package messaging

import (
	"encoding/json"
	"testing"

	"github.com/google/uuid"
)

func TestValidateMentionsUsesUTF16AndAllowsRepeatedTarget(t *testing.T) {
	userID := uuid.New()
	valid := []Mention{{UserID: userID, Start: 2, End: 4}, {UserID: userID, Start: 5, End: 7}}
	if !ValidateMentions("😀@a @b", valid) { // the emoji occupies two UTF-16 code units
		t.Fatal("expected valid UTF-16 mention ranges")
	}
	for _, test := range []struct {
		name     string
		body     string
		mentions []Mention
	}{
		{"out of bounds", "😀@a", []Mention{{UserID: userID, Start: 2, End: 6}}},
		{"surrogate split", "😀@a", []Mention{{UserID: userID, Start: 1, End: 3}}},
		{"overlapping", "@@ab", []Mention{{UserID: userID, Start: 0, End: 3}, {UserID: uuid.New(), Start: 1, End: 4}}},
		{"unsorted", "@a @b", []Mention{{UserID: userID, Start: 3, End: 5}, {UserID: uuid.New(), Start: 0, End: 2}}},
		{"nil user", "abc", []Mention{{Start: 0, End: 1}}},
		{"empty span", "@a", []Mention{{UserID: userID, Start: 0, End: 0}}},
		{"span without at sign", "Alice", []Mention{{UserID: userID, Start: 0, End: 5}}},
	} {
		t.Run(test.name, func(t *testing.T) {
			if ValidateMentions(test.body, test.mentions) {
				t.Fatal("expected invalid mention metadata")
			}
		})
	}
}

func TestMentionJSONRejectsUnknownAndMalformedFields(t *testing.T) {
	for _, input := range []string{
		`{"user_id":"` + uuid.NewString() + `","start":0,"end":1,"name":"stale"}`,
		`{"user_id":"not-a-uuid","start":0,"end":1}`,
		`{"user_id":"` + uuid.NewString() + `","start":0,"end":1} {}`,
	} {
		var mention Mention
		if err := json.Unmarshal([]byte(input), &mention); err == nil {
			t.Fatalf("accepted malformed mention JSON %s", input)
		}
	}
}

func TestValidateMentionsCapsCount(t *testing.T) {
	mentions := make([]Mention, MaxMentions+1)
	for i := range mentions {
		mentions[i] = Mention{UserID: uuid.New(), Start: i * 2, End: i*2 + 1}
	}
	if ValidateMentions("012345678901234567890123456789", mentions) {
		t.Fatal("accepted too many mentions")
	}
}

func TestNormalizeMentionOffsetsTracksTrimmedUnicodePrefix(t *testing.T) {
	mentions := []Mention{{UserID: uuid.New(), Start: 3, End: 5}}
	normalized, ok := NormalizeMentionOffsets(" 😀@i ", mentions)
	if !ok || len(normalized) != 1 || normalized[0].Start != 2 || normalized[0].End != 4 {
		t.Fatalf("normalized mentions = %+v, %t", normalized, ok)
	}
	if _, ok := NormalizeMentionOffsets(" 😀@i ", []Mention{{UserID: uuid.New(), Start: 0, End: 2}}); ok {
		t.Fatal("accepted a span touching trimmed whitespace")
	}
}
