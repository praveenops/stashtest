import { Utils } from './utils';

describe('Utils', () => {
    it('Should convert `capital case` string in title case', () => {
        const str = 'Line Extension';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('Line Extension');
    });

    it('Should convert `camel case` string in title case', () => {
        const str = 'line Extension';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('Line Extension');
    });

    it('Should convert `lower camel case` string in title case', () => {
        const str = 'iPhone';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('Iphone');
    });

    it('Should convert `small case` string in title case', () => {
        const str = 'line extension';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('Line Extension');
    });

    it('Should convert `pascal case` string in title case', () => {
        const str = 'Line Extension';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('Line Extension');
    });

    it('Should convert `sentence case` string in title case', () => {
        const str = 'Line extension';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('Line Extension');
    });

    it('Should convert string which contains number in title case', () => {
        const str = '2T WATER';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('2T Water');
    });

    it('Should convert string with underscore in title case', () => {
        const str = 'new_action';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('New_action');
    });

    it('Should convert string which has `...` as prefix in title case', () => {
        const str = '...lost';
        const result = Utils.convertInTitle(str);
        expect(result).toBe('...Lost');
    });

    describe('Utils -> trim', () => {
        it('Should trim all leading spaces in the given string', () => {
            const str = '    Test String';
            const result = Utils.trim(str);
            expect(result).toBe('Test String');
        });

        it('Should trim all trailing spaces in the given string', () => {
            const str = 'Test String     ';
            const result = Utils.trim(str);
            expect(result).toBe('Test String');
        });

        it('Should trim all leading and trailing spaces in the given string', () => {
            const str = '     Test String     ';
            const result = Utils.trim(str);
            expect(result).toBe('Test String');
        });

        it('Should trim extra spaces in between in the given string', () => {
            const str = 'Test     String';
            const result = Utils.trim(str);
            expect(result).toBe('Test String');
        });

        it('Should trim the given multi line string', () => {
            const str = '     Test     String  \n   second line\nthird line     ';
            const result = Utils.trim(str);
            expect(result).toBe('Test String\nsecond line\nthird line');
        });

        it('Should not make any change if the given string is already trimmed', () => {
            const str = 'Test String';
            const result = Utils.trim(str);
            expect(result).toBe('Test String');
        });
    });
});
