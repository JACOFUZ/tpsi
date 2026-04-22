import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Studio studio = new Studio();
        Scanner sc = new Scanner(System.in);
        int scelta = 0;

        while (scelta != 4) {
            System.out.println("\n1) Accendi  2) Spegni  3) Stato  4) Esci");
            scelta = sc.nextInt();

            if (scelta == 1 || scelta == 2) {
                System.out.println("Stanza (0=Regia, 1=Booth, 2=Sala Pausa, 3=Corridoio):");
                int idx = sc.nextInt();
                if (idx >= 0 && idx < studio.getNumStanze()) {
                    if (scelta == 1) studio.accendi(idx);
                    else             studio.spegni(idx);
                } else {
                    System.out.println("Stanza non valida.");
                }
            } else if (scelta == 3) {
                studio.mostraStato();
            }
        }

        sc.close();
        System.out.println("Programma terminato.");
    }
}
