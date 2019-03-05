/**
 *
 * @author Filipe Ribeiro; Luís Castro;
 */
public class Result {

    String wordCraked;
    boolean finded;
    int iterations;
    
    public Result() {
        this.wordCraked = "";
        this.finded = false;
        this.iterations = 0;
    }

    public boolean ifFounded() {
        return this.finded;
    }

    // synchronized - not necessary!
    public void wordFounded(String word, int iterations) {
        this.wordCraked = word;
        this.finded = true;
        this.iterations = iterations;
    }
    
    public String getWord() {
        return this.wordCraked;
    }
    
    public int getIterations() {
        return this.iterations;
    }
}
