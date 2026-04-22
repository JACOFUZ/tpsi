public class Studio {
    private Stanza[] stanze;

    public Studio() {
        stanze = new Stanza[] {
            new Stanza("Regia"),
            new Stanza("Booth"),
            new Stanza("Sala Pausa"),
            new Stanza("Corridoio")
        };
    }

    public void accendi(int i) { stanze[i].accendi(); }
    public void spegni(int i)  { stanze[i].spegni();  }

    public void mostraStato() {
        System.out.println("--- STUDIO ---");
        for (Stanza s : stanze)
            System.out.println(s.getStato());
    }

    public int getNumStanze() { return stanze.length; }
}
