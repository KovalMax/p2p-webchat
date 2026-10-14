import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SupportReferenceClipboardService {
    public async copy(value: string): Promise<void> {
        const clipboard = globalThis.navigator?.clipboard;
        if (!clipboard || typeof clipboard.writeText !== 'function') throw new Error('Clipboard API unavailable');
        await clipboard.writeText(value);
    }
}
