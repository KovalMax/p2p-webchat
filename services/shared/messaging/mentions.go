package messaging

import (
	"strings"
	"unicode"
	"unicode/utf16"
	"unicode/utf8"

	"github.com/google/uuid"
)

const MaxMentions = 16

// ValidateMentions checks UTF-16 half-open ranges and rejects ambiguous or
// malformed metadata. Repeated mentions of a user are valid; overlapping
// ranges are not.
func ValidateMentions(body string, mentions []Mention) bool {
	if len(mentions) > MaxMentions || !utf8.ValidString(body) {
		return false
	}
	length := len(utf16.Encode([]rune(body)))
	boundaries := map[int]struct{}{0: {}, length: {}}
	atSignOffsets := make(map[int]struct{})
	for offset := 0; offset < length; {
		r, size := utf8.DecodeRuneInString(body)
		if r == '@' {
			atSignOffsets[offset] = struct{}{}
		}
		offset += len(utf16.Encode([]rune{r}))
		body = body[size:]
		boundaries[offset] = struct{}{}
	}
	lastEnd := 0
	for i, mention := range mentions {
		if mention.UserID == uuid.Nil || mention.Start < 0 || mention.End <= mention.Start+1 || mention.End > length {
			return false
		}
		if _, ok := atSignOffsets[mention.Start]; !ok {
			return false
		}
		if _, ok := boundaries[mention.Start]; !ok {
			return false
		}
		if _, ok := boundaries[mention.End]; !ok {
			return false
		}
		if i > 0 && mention.Start < lastEnd {
			return false
		}
		lastEnd = mention.End
	}
	return true
}

// MentionUserIDs returns distinct targets while preserving first-seen order.
func MentionUserIDs(mentions []Mention) []uuid.UUID {
	seen := make(map[uuid.UUID]struct{}, len(mentions))
	ids := make([]uuid.UUID, 0, len(mentions))
	for _, mention := range mentions {
		if _, ok := seen[mention.UserID]; ok {
			continue
		}
		seen[mention.UserID] = struct{}{}
		ids = append(ids, mention.UserID)
	}
	return ids
}

// NormalizeMentionOffsets maps ranges from the submitted body to the sender's
// existing trimmed-body representation. A span touching trimmed text is stale.
func NormalizeMentionOffsets(body string, mentions []Mention) ([]Mention, bool) {
	trimmedPrefix := strings.TrimLeftFunc(body, unicode.IsSpace)
	prefix := body[:len(body)-len(trimmedPrefix)]
	shift := len(utf16.Encode([]rune(prefix)))
	normalized := make([]Mention, len(mentions))
	for i, mention := range mentions {
		if mention.Start < shift || mention.End < shift {
			return nil, false
		}
		mention.Start -= shift
		mention.End -= shift
		normalized[i] = mention
	}
	return normalized, true
}
