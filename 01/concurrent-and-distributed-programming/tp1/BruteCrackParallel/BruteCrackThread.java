import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Filipe Ribeiro; Luís Castro;
 */
public class BruteCrackThread implements Runnable {
    char[] _alphabet;
    char _minCharValue;
    char _maxCharValue;
    
    /* Thread Local Variables */
    int threadId;
    Result result;

    MessageDigest _md;
    char beginRange;
    char endRange;
    int mumberOfChars;
    char[] guessLetters;
    String guessHash;
    String hashToCrack;
    int[] ranges;
    int iterations;

    public BruteCrackThread(int threadId, Result result,Variables variables, String hashToCrack) throws NoSuchAlgorithmException {
        this._md = MessageDigest.getInstance("SHA-512");
        this.threadId = threadId;
        this.result = result;
        this.hashToCrack = hashToCrack;

        this._alphabet = variables.getAlphabet();
        this._minCharValue = variables.getMinCharValue();
        this._maxCharValue = variables.getMaxCharValue();

        this.ranges = variables.getThreadRanges(threadId);
        
        this.beginRange = this._alphabet[ranges[0]];
        this.endRange = this._alphabet[ranges[1]];

        this.guessLetters = new char[1];
        this.guessLetters[0] = this._alphabet[ranges[0]];
        this.iterations = 0;
    }

    @Override
    public void run() {
        try {
            crack();
        } catch (InterruptedException | NoSuchAlgorithmException ex) {
            Logger.getLogger(BruteCrackThread.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void crack() throws InterruptedException, NoSuchAlgorithmException  {
        String crackedWord;
        
        while (!this.result.ifFounded()) {
            this.iterations++;
            this.guessHash = stringHexHash(new String(this.guessLetters));
            
            if (guessHash.equals(this.hashToCrack)) {
                crackedWord = new String(guessLetters);
                this.result.wordFounded(crackedWord, this.iterations);
                break;
            }
            incrementarChars();
            this._md.reset();
        }

    }
    
    public void incrementarChars() {
        int n = this.guessLetters.length - 1;
        
        char _end = this._maxCharValue;
        
        while (n >= 0) {
            if (n == 0) {
                _end = endRange;
            }
            if (guessLetters[n] < _end) {
                this.guessLetters[n] = (char) ((int) this.guessLetters[n] + 1);
                break;
            }
            if (n == 0) {
                int t = this.guessLetters.length + 1;
                this.guessLetters = new char[t];
                for (int x = 0; x < t; x++) {
                    this.guessLetters[x] = this._minCharValue;
                }
                guessLetters[0] = this._alphabet[this.ranges[0]];
                break;
            }
            guessLetters[n] = this._minCharValue;
            n--;
   
        }
    }
    
    public String stringHexHash(String word) throws NoSuchAlgorithmException {
        byte[] hash = this._md.digest(word.getBytes(StandardCharsets.ISO_8859_1));
        return javax.xml.bind.DatatypeConverter.printHexBinary(hash);
    }
}

