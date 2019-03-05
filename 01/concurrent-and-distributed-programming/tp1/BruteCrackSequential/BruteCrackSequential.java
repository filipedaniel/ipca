import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Filipe Ribeiro; Luís Castro;
 */

public class BruteCrackSequential {
    MessageDigest md;
    char[] alphabet = "abcdefghijklmnopqrstuvwxyz".toCharArray();
    char[] guessLetters;
    String guessHash;
    char minCharValue;
    char maxCharValue;
    int iterations;
    int maxChars;

    public BruteCrackSequential(int maxChars) throws NoSuchAlgorithmException {
        this.md = MessageDigest.getInstance("SHA-512");
        // Prepare start - start with 'a'
        this.guessLetters = new char[1];
        this.guessLetters[0] = this.alphabet[0];
        this.minCharValue = this.alphabet[0];
        this.maxCharValue = this.alphabet[this.alphabet.length - 1];
        this.iterations = 0;
        this.maxChars = maxChars;
    }

    /* Crack the hashToCrack word */
    public String crack(String hashToCrack) throws NoSuchAlgorithmException, InterruptedException, Exception {
        String crackedWord;
        String tempGuess;
        while (true) {
            this.iterations++;
            tempGuess = new String(this.guessLetters);
            if (tempGuess.length() > maxChars) {
                throw new Exception("Exceeded the maximum of characters!");
            }
            this.guessHash = stringHexHash(tempGuess);
            
            if (guessHash.equals(hashToCrack)) {
                crackedWord = new String(guessLetters);
                break;
            }
            incrementGuess();
            this.md.reset();
        }

       return crackedWord;
    }

    /* Increment guess letters array */
    public void incrementGuess() throws InterruptedException {
        int n = this.guessLetters.length - 1;
        
        while (n >= 0) {
            if (this.guessLetters[n] < this.maxCharValue) {
                this.guessLetters[n] = (char) ((int) this.guessLetters[n] + 1);
                break;
            }
            if (n == 0) {
                int t = this.guessLetters.length + 1;
                this.guessLetters = new char[t];
                for (int x = 0; x < t; x++) {
                    this.guessLetters[x] = this.minCharValue;
                }
                break;
            }
            this.guessLetters[n] = this.minCharValue;
            n--;
        }
    }

    /* Return the Hash of one string */
    public String stringHexHash(String word) throws NoSuchAlgorithmException {
        byte[] hash = this.md.digest(word.getBytes(StandardCharsets.ISO_8859_1));
        return javax.xml.bind.DatatypeConverter.printHexBinary(hash);
    }

    
    // #########################################################################
    /**
     * Main Functions
     */
    public static void main(String[] args) {
        /**
         * zoom: DD8D98401D41639578A18327DC41B706E2F22C5B44648353D4343EDFB26DA8A81E730D115D1E21BE1E1D7EB30935C0F48D88307E1D64EB89E87B534D8CB671F3
         * zigzag: 53DB64256C9C326A42517ACA4AF6A272484AC9EDE9E04AA8D79880B03F2C37164D23C2983625F20069C880BBFC8A7CDAD5A2C0FD07BC43ADCA27C5A3AA854D5A
         * zirconium: B099007D9652ED81799EA79E463F86014CDF26CAB79B831CD87C5843990F7599DF9FC35563A20FF4CC91CA26A76EC54D3DB65EDB6EC14F4D6F5BB9C673940DE7
         */
            
        Scanner scanner = new Scanner(System.in);
        System.out.println("> SHA-512 Hash to crack?");
        System.out.print("$ ");
        String hashToCrack = scanner.next();
        
        System.out.println("> Maximum of characters?");
        System.out.print("$ ");
        int maxChars = scanner.nextInt();
        
        try {
            BruteCrackSequential bruteCrack = new BruteCrackSequential(maxChars);
            
            System.out.println("\nStart Crack...");
            
            long begin = System.nanoTime();
            String wordCraked = bruteCrack.crack(hashToCrack);
            long end = System.nanoTime();

            System.out.println("Word Cracked: " + wordCraked);
            System.out.println("Tested words: " + bruteCrack.iterations);
            System.out.println("time (secs): " + (end - begin) / 1.0e9);
            
        } catch (NoSuchAlgorithmException | InterruptedException ex) {
            Logger.getLogger(BruteCrackSequential.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            System.err.println(ex);
        }   
    }
}
