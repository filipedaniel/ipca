/**
 *
 * Class District, contains info about one district, 
 * like total of fires, total of burned area
 *
 */
public class District {
  private String name;
  private String publicName;
  private float fires;
  private float burnedArea;
  private float originalFires;
  private float originalBurnedArea;
  private int posX;
  private int posY;

  private float aniFires = 0;
  private float aniBurnedArea = 0;

  District () {
    name = "";
    publicName = "";
    fires = 0.0;
    burnedArea = 0.0;
    originalFires = 0.0;
    originalBurnedArea = 0.0;
    posX = 0;
    posY = 0;
  }

  District (String n, String pn, float f, float ba, float of, float oba, int xx, int yy) {
    name = n;
    publicName = pn;
    fires = f;
    burnedArea = ba;
    originalFires = of;
    originalBurnedArea = oba;
    posX = xx;
    posY = yy;
  }

  /* get methods */
  String getName() {
    return name;
  }

  String getPublicName() {
    return publicName;
  }

  float getFires() {
    return fires;
  }

  float getBurnedArea() {
    return burnedArea;
  }

  float getOriginalFires() {
    return originalFires;
  }

  float getOriginalBurnedArea() {
    return originalBurnedArea;
  }

  int getPosX() {
    return posX;
  }

  int getPosY() {
    return posY;
  }

  /* set methods */
  void setName(String n) {
    name = n;
  }

  void setPublicName(String pn) {
    publicName = pn;
  }

  void setFires(float f) {
    fires = f;
  }

  void setBurnedArea(float ba) {
    burnedArea = ba;
  }

  void setPosX(int xx) {
    posX = xx;
  }
  void setPosY(int yy) {
    posY = yy;
  }

  /* ----------------------------- */
  void updateBurnedArea(float ba) {
    burnedArea += ba;
    originalBurnedArea += ba;
    fires++; 
    originalFires++;
  }

  void printInfo() {
    println("Name: "+name);
    println("Fires: "+fires);
    println("BurdedArea: "+burnedArea);
    println("---------");
  }

  void resetAnimations() {
    aniFires = 0;
    aniBurnedArea = 0;
  }

  void drawDistrict() {

    noStroke();
    if (burnedArea > fires) {
      fill(Consts.COLOR_BURNED_AREA, 80);
      Ani.to(this, 0.8, "aniBurnedArea", burnedArea);
      ellipse(posX, posY, aniBurnedArea, aniBurnedArea);
      fill(Consts.COLOR_FIRE);
      Ani.to(this, 0.8, "aniFires", fires);
      ellipse(posX, posY, aniFires, aniFires);
    } else {
      fill(Consts.COLOR_FIRE, 80);
      Ani.to(this, 0.8, "aniFires", fires);
      ellipse(posX, posY, aniFires, aniFires);
      fill(Consts.COLOR_BURNED_AREA);
      ellipse(posX, posY, burnedArea, burnedArea);
    }
  }

  void drawDistrictInfo(int xx, int yy) {
    String l = publicName
      + "\nÁrea Ardida: " + originalBurnedArea + " ha"
      + "\nTotal de Fogos: " + int(originalFires) + " fogos";

    smooth(); 
    textAlign(CENTER); 
    fill(Consts.COLOR_TEXT_LEVEL3);
    text(l, xx, yy);
  }
}