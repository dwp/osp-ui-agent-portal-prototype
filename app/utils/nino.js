class Nino {
    /**
     *  
     *  !!!!! Widows Pension regex - not the same as what OSPr requires !!!!!! 
     * 
     * 
     * Validate the nino is in the correct format
     *
     * ```markdown
     * - Must contain 9 characters
     * - First 2 characters must be text based (A through Z)
     * - Characters 3 to 8 must be numeric (0 through 9)
     * - The final character must be text based (A through Z)
     * - The characters D F I Q U and V are not used as either the first or second letter of a NINO prefix.
     * - The letter O is not used as the second letter of a prefix.
     * - Prefixes BG, GB, KN, NK, NT, TN and ZZ are not to be used
     * ```
     * @param {string} nino
     */
    static isValidNino(nino) {
        if (nino.trim()?.length === 0) return false;

        const cleanedNino = nino.replace(/\u0020/g, "");

        const ninoRegex = /^(?!BG|GB|NK|KN|TN|NT|ZZ)[ABCEGHJ-PRSTW-Z][ABCEGHJ-NPRSTW-Z]\d{6}[A-DX ]?$/i;

        return cleanedNino.match(ninoRegex) !== null;
    }
}

module.exports = Nino;