package transportbroker;

import actors.ClientActor;
import actors.ManagerActor;
import actors.ProviderActor;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import messages.StartMessage;

import java.io.IOException;
import java.util.Scanner;


public class TransportBroker {

    private static JsonFilesParams[] providers;
    private static JsonFilesParams traveltimes;

    public static void main(String[] args) throws IOException, org.json.simple.parser.ParseException {

        ActorSystem system = ActorSystem.create("transport-broker-akka");
        ReadJsonFile readJsonFiles = new ReadJsonFile();

        // Read Providers
        providers = readJsonFiles.readJsonFiles("providers");
        // Read Travel times
        traveltimes = readJsonFiles.readJsonFile("times.json");

        // Create all Provider Actors
        ActorRef[] providersActors = new ActorRef[providers.length];
        for (int i = 0; i < providers.length; i++) {
            providersActors[i] = system.actorOf(Props.create(ProviderActor.class, providers[i], traveltimes));
        }

        // Initial Menu
        Scanner scanner = new Scanner(System. in );
        System.out.println("Insira o número da execução a testar!");
        System.out.println("1 - Um único agente cliente, três agentes fornecedores (Fornecedor A, B e C). O agente cliente simula uma sequência de pedidos de 15 viagem (ficheiro: ./files/execution-i/travels.json)");
        System.out.println("2 - Dois agentes clientes (por default). Com base num ficheiro de texto com num total de 60 viagens (ficheiro: ./files/execution-ii-iii/travels.json), cada agente cliente executa uma viagem desta lista, sendo todas as viagens repartidas pelos número de agentes.");
        System.out.println("0 - Sair");
        System.out.println("(Obs:. Toda a informação sobre os custos das viagens para cada fornecedor estão a ser lidos de ficheiros, (./files/providers/).");

        System.out.print("$ ");
        int scannerOption = Integer.parseInt(scanner.next());
        switch (scannerOption) {
            /* ---------------------------------------------------------------------------------------------------------
             * Execution I
             */
            case 1: {
                int NUMBER_OF_CLIENTS = 1;

                // Read List of Travels for execution-i
                JsonFilesParams travels = readJsonFiles.readJsonFile("execution-i/travels.json");

                // Create all Clients Actors
                ActorRef[] clientActors = new ActorRef[NUMBER_OF_CLIENTS];
                for (int i = 0; i < NUMBER_OF_CLIENTS; i++) {
                    clientActors[i] = system.actorOf(Props.create(ClientActor.class, i, providersActors));
                }

                // Create manager actor
                ActorRef managerActor = system.actorOf(Props.create(ManagerActor.class, clientActors, travels.getData()));
                managerActor.tell(new StartMessage(), ActorRef.noSender());
                break;
            }
            /* ---------------------------------------------------------------------------------------------------------
             * Execution II - III
             */
            case 2: {
                // Create all actorActors
                //int NUMBER_OF_CLIENTS = 2;

                System.out.print("Número de Clientes?");
                int NUMBER_OF_CLIENTS = Integer.parseInt(scanner.next());

                // Read List of Travels for Execution-II
                JsonFilesParams travels = readJsonFiles.readJsonFile("execution-ii-iii/travels.json");

                ActorRef[] clientActors = new ActorRef[NUMBER_OF_CLIENTS];
                for (int i = 0; i < NUMBER_OF_CLIENTS; i++) {
                    clientActors[i] = system.actorOf(Props.create(ClientActor.class, i, providersActors));
                }

                // Create manager actor
                ActorRef managerActor = system.actorOf(Props.create(ManagerActor.class, clientActors, travels.getData()));
                managerActor.tell(new StartMessage(), ActorRef.noSender());

                break;
            }
            case 0 : {
                system.shutdown();
                System.exit(0);
                break;
            }
            default: {
                System.out.println("Opção não valida!");
                system.shutdown();
                break;
            }
        }
    }
}