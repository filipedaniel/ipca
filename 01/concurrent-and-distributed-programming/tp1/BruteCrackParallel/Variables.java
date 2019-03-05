import java.util.Arrays;

/**
 *
 * @author Filipe Ribeiro; Luís Castro;
 */
public class Variables {
    
    char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
    char minCharValue;
    char maxCharValue;
    int numThreads;
    int[][] threadsRanges;
    
    public Variables(int numThreads) {
        this.minCharValue = this.alphabet[0];
        this.maxCharValue = this.alphabet[this.alphabet.length - 1];
        this.numThreads = numThreads;
        this.threadsRanges = threadsRanges();
    }

    public char[] getAlphabet() {
        return alphabet;
    }

    public char getMinCharValue() {
        return minCharValue;
    }

    public char getMaxCharValue() {
        return maxCharValue;
    }

    public int getNumThreads() {
        return numThreads;
    }

    public int[][] getThreadsRanges() {
        return threadsRanges;
    }

    public int[] getThreadRanges(int threadIndex) {
        return threadsRanges[threadIndex];
    }

    private int[][] threadsRanges() {
        int alphabetLength = this.alphabet.length;
        int[][] ranges = new int[this.numThreads][2];
        
        int begin;
        int end;
        
        for (int i = 0; i < this.numThreads; i++) {

            begin = i * alphabetLength / this.numThreads;
            end = (i + 1) * alphabetLength / this.numThreads;

            ranges[i][0] = begin;
            ranges[i][1] = end - 1;
        }
        
        return ranges;
    }
    
    @Override
    public String toString() {
        String res = "ALPHABET: " + new String(this.alphabet) + ";\n"
                + "minCharValue: " + this.minCharValue + ";\n"
                + "maxCharValue: " + this.maxCharValue + ";\n"
                + "threads: " + this.numThreads + " - " + Arrays.deepToString(threadsRanges);
        return res;
    }

}
