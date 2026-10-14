import {isValidMessageMentions, messageTextSegments, updateMentionRanges} from './message.model';

describe('message mentions', () => {
    it('validates sorted half-open UTF-16 ranges without splitting surrogate pairs and permits repeated targets', () => {
        const text = '😀 @Alice';
        expect(isValidMessageMentions([{userId: 'alice', start: 3, end: 9}], text)).toBe(true);
        expect(isValidMessageMentions([{userId: 'alice', start: 1, end: 3}], text)).toBe(false);
        expect(isValidMessageMentions([{userId: 'alice', start: 3, end: 9}, {userId: 'bob', start: 8, end: 9}], text)).toBe(false);
        expect(isValidMessageMentions([{userId: 'alice', start: 0, end: 2}, {userId: 'alice', start: 3, end: 5}], '@a @b')).toBe(true);
        expect(isValidMessageMentions([{userId: 'alice', start: 0, end: 5}], 'Alice')).toBe(false);
        expect(isValidMessageMentions(Array.from({length: 17}, (_, i) => ({userId: `u${i}`, start: i * 3, end: i * 3 + 2})), '@a '.repeat(17))).toBe(false);
    });

    it('renders only validated metadata as safe text segments', () => {
        expect(messageTextSegments('Hi @Alice <script>', [{userId: 'alice', start: 3, end: 9}])).toEqual([
            {text: 'Hi ', mentioned: false}, {text: '@Alice', mentioned: true}, {text: ' <script>', mentioned: false},
        ]);
        expect(messageTextSegments('@Alice', [{userId: 'alice', start: 1, end: 99}])).toEqual([{text: '@Alice', mentioned: false}]);
        expect(messageTextSegments('@Alice', undefined)).toEqual([{text: '@Alice', mentioned: false}]);
    });

    it('shifts ranges for edits outside a mention and removes a range when its text is edited', () => {
        const mention = [{userId: 'alice', start: 4, end: 10}];
        expect(updateMentionRanges('Say @Alice', 'Say more @Alice', mention)).toEqual([{userId: 'alice', start: 9, end: 15}]);
        expect(updateMentionRanges('Say @Alice', 'Say @Ally', mention)).toEqual([]);
    });
});
