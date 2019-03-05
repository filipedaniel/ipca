import java.security.NoSuchAlgorithmException;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Filipe Ribeiro; Luís Castro;
 */

public class BruteCrack {
    
    public static void main(String[] args)  {
        
        try {
            Scanner scanner;
            scanner = new Scanner(System.in);
            /**
            * zoom: DD8D98401D41639578A18327DC41B706E2F22C5B44648353D4343EDFB26DA8A81E730D115D1E21BE1E1D7EB30935C0F48D88307E1D64EB89E87B534D8CB671F3
            * zigzag: 53DB64256C9C326A42517ACA4AF6A272484AC9EDE9E04AA8D79880B03F2C37164D23C2983625F20069C880BBFC8A7CDAD5A2C0FD07BC43ADCA27C5A3AA854D5A
            * zirconium: B099007D9652ED81799EA79E463F86014CDF26CAB79B831CD87C5843990F7599DF9FC35563A20FF4CC91CA26A76EC54D3DB65EDB6EC14F4D6F5BB9C673940DE7
            */
           
            System.out.println("> SHA-512 Hash to crack?");
            System.out.print("$ ");
            String hashToCrack = scanner.next();
            
            System.out.println("> Number of Threads? (max: 26)");
            System.out.print("$ ");
            int numThreads = scanner.nextInt();

            Variables variables = new Variables(numThreads);
            Result result = new Result();
            //System.out.println(variables.toString());
            
            System.out.println("\nStart Crack...");
            
            Thread[] threads = new Thread[numThreads];
            long begin = System.nanoTime();
            for (int i = 0; i < numThreads; i++) {
                threads[i] = new Thread(new BruteCrackThread(i, result, variables, hashToCrack));
                threads[i].start();
            }
            for (int i = 0; i < numThreads; i++) {
                threads[i].join();
            }
            long end = System.nanoTime();
            
            System.out.println("Word Cracked: " + result.getWord());
            System.out.println("Tested words: " + result.getIterations());
            System.out.println("time (secs): " + (end - begin) / 1.0e9);
            
        } catch (NoSuchAlgorithmException | InterruptedException ex) {
            Logger.getLogger(BruteCrack.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
