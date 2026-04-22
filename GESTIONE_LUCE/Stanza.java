public class Stanza {
    private String nome;
    private boolean luceAccesa;

    public Stanza(String nome) {
        this.nome = nome;
        this.luceAccesa = false;
    }

    public void accendi() { luceAccesa = true; }
    public void spegni()  { luceAccesa = false; }

    public String getStato() {
        String stato = luceAccesa ? "[ON] " : "[OFF]";
        return stato + " " + nome;
    }
}
