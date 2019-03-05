/* IMPORTS */
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;
import java.util.Set;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;
import java.text.Normalizer;
import controlP5.*;
import de.looksgood.ani.*;
/* --------------------------------------------------------------------------*/

/* VARIABLES MENU */
ControlP5 cp5;
Accordion accordion;
boolean menuRegionsClosed = true;

int menuWidth = 300;
int menuGroupHeight = 17;
int menuGroupWidth = 140;
ControlFont controlFont;
int accordionPosX = 30;
int accordionPosY = 180;

/*--------------------------------------------------------------------------*/
/* NAVIGATION HISTORY */
List<Integer> navigationHistory = new ArrayList<Integer>();

/*--------------------------------------------------------------------------*/

/* FONTS */
PFont robotoRegular48, 
      robotoRegular22, 
      robotoRegular20, 
      robotoRegular18, 
      robotoRegular16, 
      robotoRegular14, 
      robotoRegular12;

/*--------------------------------------------------------------------------*/
/* GLOBAL VARIABLES */

// Hashmap with all years data 
HashMap<String, Year> years = new HashMap<String, Year>();

// max values, to map the values
float maxTotalFires = 0.0;
float maxTotalBurnedArea = 0.0;

Button beginButton, homeButton, backButton;
// general year menu
Button yearShowDistricts, 
  yearsShowType, 
  yearsShowCause, 
  yearsShowStats;

/*--------------------------------------------------------------------------*/
/* VIEWPORT VARIABLE  */
int sectionView = 0;
String viewportShowDistrict;
String viewportShowYear;

/*--------------------------------------------------------------------------*/
/* ANIMATION VARIABLES */
float animTamanhoGrafico1 = 0;
float animTamanhoGrafico2 = 0;
float animTamanhoGrafico3 = 0;
float animTamanhoGrafico4 = 0;
float animTamanhoGrafico5 = 0;
float animTamanhoGrafico6 = 0;
float animTamanhoGrafico7 = 0;
float animTamanhoGrafico8 = 0;
float aniPosicaoXTituloPais = 0;
float aniPosicaoTituloProjeto = 50;

/*--------------------------------------------------------------------------*/

// images
PImage ipcaLogo, icnfLogo;
Map<Integer, HashMap<Float, PImage>> yellowFlames = new HashMap<Integer, HashMap<Float, PImage>>();
Map<Integer, HashMap<Float, PImage>> redFlames = new HashMap<Integer, HashMap<Float, PImage>>();
// portugal map variables
PVector[] vectorArray;
String districtName;
ControlP5 toggleMapView;
boolean seeFires = true;
HashMap<String, PVector[]> districtMap = new HashMap<String, PVector[]>();
Colors typeColors = new Colors();
Colors causesColors = new Colors();



/*--------------------------------------------------------------------------*/

/* SETUP FUNCTION */
void setup() {
  size(1280, 680);
  controlFont = new ControlFont(createFont("Verdana", 10));
  background(255);
  surface.setTitle("Incêndios em Portugal"); 
  Ani.init(this);
  fill(0);
  textSize(16);
  
  /* fonts */
  robotoRegular48 = loadFont("Roboto-Regular-48.vlw");
  robotoRegular22 = loadFont("Roboto-Regular-22.vlw");
  robotoRegular20 = loadFont("Roboto-Regular-20.vlw");
  robotoRegular18 = loadFont("Roboto-Regular-18.vlw");
  robotoRegular16 = loadFont("Roboto-Regular-16.vlw");
  robotoRegular14 = loadFont("Roboto-Regular-14.vlw");
  robotoRegular12 = loadFont("Roboto-Regular-12.vlw");

  ipcaLogo = loadImage("ipca-logo.png");
  icnfLogo = loadImage("icnf-logo.png");
  
  // import data
  importData();
  // import map
  importPortugalMap();
  // draw LeftMenu *after importData
  drawMenu();
  //add initial screen to navigation history
  navigationHistory.add(sectionView);

  toggleMapView = new ControlP5(this);
  toggleMapView.addToggle("toggleFires")
    .setSize(60, 20)
    .setValue(true)
    .setMode(ControlP5.SWITCH)
    .setColorBackground(Consts.COLOR_GRAY1)
    .setColorActive(Consts.COLOR_1)
    .setCaptionLabel("")
    ;

  noStroke();
  beginButton = new Button(width/2-70, height/2-60, 140, 50, "INÍCIO", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 16,robotoRegular16);
  noStroke();
  homeButton = new Button(10, 10, 60, 30, "INÍCIO", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 12,robotoRegular12);
  backButton = new Button(80, 10, 60, 30, "VOLTAR", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 12,robotoRegular12);

  yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 16,robotoRegular16);
  yearsShowType = new Button(450, height-60, 120, 40, "TIPOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 16,robotoRegular16);
  yearsShowCause = new Button(600, height-60, 120, 40, "CAUSAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 16,robotoRegular16);
  yearsShowStats = new Button(750, height-60, 120, 40, "ESTATÍSTICAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 16,robotoRegular16);
}

/* DRAW FUNCTION */
void draw() {
  background(255);
  textSize(10);

  if (sectionView == 0 ) {
    cp5.hide();
  }

  if (sectionView != 0 ) {
    cp5.show();

    textAlign(LEFT);
    noStroke();
    homeButton.update();
    backButton.update();
  }
  if (homeButton.clicked) {
    sectionView = 0;
    resetAnimations();
  }
  if (backButton.clicked) {
    if (navigationHistory.size() > 1) {
      sectionView = navigationHistory.remove(navigationHistory.size() -1);
    }
    sectionView = navigationHistory.get(navigationHistory.size() -1);
    resetAnimations();
  }

  toggleMapView.setPosition(width-230, 35);
  toggleMapView.hide();

  switch (sectionView) {
  case 100:    //"btnNivelNacional":
    drawGeneralScreen();
    break;

    // draw by districts
  case 1000:    //"btnAVEIRO":
    viewportShowDistrict = "Aveiro";
    drawDistrictScreen();
    break;

  case 1001:    //"btnBeja":
    viewportShowDistrict = "Beja";
    drawDistrictScreen();
    break;

  case 1002:    //"btnBraga":
    viewportShowDistrict = "Braga";
    drawDistrictScreen();
    break;

  case 1003:    //"btnBraganca":
    viewportShowDistrict = "Braganca";
    drawDistrictScreen();
    break;

  case 1004:    //"btnCASTELOBRANCO":
    viewportShowDistrict = "Castelo Branco";
    drawDistrictScreen();
    break;

  case 1005:    //"btnCoimbra":
    viewportShowDistrict = "Coimbra";
    drawDistrictScreen();
    break;

  case 1006:    //"btnEvora":
    viewportShowDistrict = "Evora";
    drawDistrictScreen();
    break;

  case 1007:    //"btnFaro":
    viewportShowDistrict = "Faro";
    drawDistrictScreen();
    break;

  case 1008:    //"btnGuarda":
    viewportShowDistrict = "Guarda";
    drawDistrictScreen();
    break;

  case 1009:    //"btnLeiria":
    viewportShowDistrict = "Leiria";
    drawDistrictScreen();
    break;

  case 1010:    //"btnLisboa":
    viewportShowDistrict = "Lisboa";
    drawDistrictScreen();
    break;

  case 1011:    //"btnPortalegre":
    viewportShowDistrict = "Portalegre";
    drawDistrictScreen();
    break;

  case 1012:    //"btnPorto":
    viewportShowDistrict = "Porto";
    drawDistrictScreen();
    break;

  case 1013:    //"btnSantarem":
    viewportShowDistrict = "Santarem";
    drawDistrictScreen();
    break;

  case 1014:    //"btnSetubal":
    viewportShowDistrict = "Setubal";
    drawDistrictScreen();
    break;

  case 1015:    //"btnViana do Castelo":
    viewportShowDistrict = "Viana do Castelo";
    drawDistrictScreen();
    break;

  case 1016:    //"btnVila Real":
    viewportShowDistrict = "Vila Real";
    drawDistrictScreen();
    break;

  case 1017:    //"btnViseu":
    viewportShowDistrict = "Viseu";
    drawDistrictScreen();
    break;

    //  types by year
  case 21:    //"btn2013" //Districts
    viewportShowYear = "2013";
    drawYearRegionalScreen(2);
    break;

  case 22:    //"btn2013" //Tipos
    viewportShowYear = "2013";
    drawYearTypeScreen(2);
    break;

  case 23:    //"btn2013" //Causas
    viewportShowYear = "2013";
    drawYearCausesScreen(2);
    break;

  case 24:    //"btn2013" //Estatisticas
    viewportShowYear = "2013";
    drawYearStatisticsScreen(2);
    break;

  case 31:    //"btn2014" //Districts
    viewportShowYear = "2014";
    drawYearRegionalScreen(3);
    break;

  case 32:    //"btn2014" //Tipos
    viewportShowYear = "2014";
    drawYearTypeScreen(3);
    break;

  case 33:    //"btn2014" //Causas
    viewportShowYear = "2014";
    drawYearCausesScreen(3);
    break;

  case 34:    //"btn2014" //Estatisticas
    viewportShowYear = "2014";
    drawYearStatisticsScreen(3);
    break;

  case 41:    //"btn2015" //Districts
    viewportShowYear = "2015";
    drawYearRegionalScreen(4);
    break;

  case 42:    //"btn2015" //Tipos
    viewportShowYear = "2015";
    drawYearTypeScreen(4);
    break;

  case 43:    //"btn2015" //Causas
    viewportShowYear = "2015";
    drawYearCausesScreen(4);
    break;

  case 44:    //"btn2015" //Estatisticas
    viewportShowYear = "2015";
    drawYearStatisticsScreen(4);
    break;

  case 61:    //"btn2016":
    break;

  case 71:    //"btn2017":
    break;

  case 0 :
    drawHome();
    break;
  }
}


// --------------------------------------------------------------------------
/* PRIVATE METHODS */

/* DRAW HOME - SECTION 0 */
void drawHome() {
  textAlign(CENTER);
  fill(Consts.COLOR_TEXT_LEVEL1);
  textFont(robotoRegular48,48);
  text("Incêndios em Portugal\n2013 - 2015", width/2, 140);
  image(ipcaLogo, 30, height-90, 115, 66);
  image(icnfLogo, width-207, height-90, 177, 60);
  textAlign(CENTER);

  textFont(robotoRegular18,18);
  fill(Consts.COLOR_TEXT_LEVEL2);
  text("Desenvolvimento de Interfaces Aplicacionais", width/2, height/2+80);
  text("Mestrado em Engenharia Informática", width/2, height/2+110);

  fill(Consts.COLOR_TEXT_LEVEL3);
  textFont(robotoRegular16,16);
  text("a15060 - Luís Castro", width/2, height/2+180);
  text("a15061 - Filipe Ribeiro", width/2+6, height/2+210);
  textAlign(LEFT);
  noStroke();
  beginButton.update();
  if (beginButton.clicked) {
    sectionView = 100;
    navigationHistory.add(sectionView);
  }
}

void drawGeneralScreen() {
  textAlign(CENTER);
  textFont(robotoRegular22,22);
  fill(Consts.COLOR_TEXT_LEVEL1);
  text("Incêndios em Portugal\n"+years.keySet().toArray()[years.size() - 1]+" - "+years.keySet().toArray()[0], width/2, 30);

  textFont(robotoRegular16,16);
  for (Map.Entry m : years.entrySet()) {
    Year y = (Year) m.getValue();
    y.drawYear();
    y.drawYearInfo();
  }

  int firstX = years.get(years.keySet().toArray()[0]).getPosX();
  String firstYear = years.get(years.keySet().toArray()[0]).getName();

  int secX = years.get(years.keySet().toArray()[1]).getPosX();
  String secYear = years.get(years.keySet().toArray()[1]).getName();

  int lastX = years.get(years.keySet().toArray()[2]).getPosX();
  String lastYear = years.get(years.keySet().toArray()[2]).getName();
  stroke(Consts.COLOR_TEXT_LEVEL3);
  line(firstX, height-40, lastX, height-40);
  line(firstX, height-45, firstX, height-35);
  line(secX, height-45, secX, height-35);
  line(lastX, height-45, lastX, height-35);

  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text(firstYear, firstX, height-20);
  text(secYear, secX, height-20);
  text(lastYear, lastX, height-20);

  textAlign(LEFT);
  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text("*Passe com o rato por cima dos circulos\npara obter mais informação!",30,height-45);
}

void drawDistrictScreen() {
  textAlign(CENTER);
  textFont(robotoRegular22,22);
  fill(Consts.COLOR_TEXT_LEVEL1);
  String districtPublicName = years.get(years.keySet().toArray()[0]).getDistrict(viewportShowDistrict).getPublicName();
  text("Incêndios em Portugal\n"+years.keySet().toArray()[years.size() - 1]+" - "+years.keySet().toArray()[0]+"\n"+districtPublicName, width/2, 30);

  textFont(robotoRegular16,16);
  for (Map.Entry m : years.entrySet()) {
    Year y = (Year) m.getValue();
    y.drawYearDistrict(viewportShowDistrict);
    y.drawYearDistrictInfo(viewportShowDistrict);
  }

  int firstX = years.get(years.keySet().toArray()[0]).getPosX();
  String firstYear = years.get(years.keySet().toArray()[0]).getName();

  int secX = years.get(years.keySet().toArray()[1]).getPosX();
  String secYear = years.get(years.keySet().toArray()[1]).getName();

  int lastX = years.get(years.keySet().toArray()[2]).getPosX();
  String lastYear = years.get(years.keySet().toArray()[2]).getName();
  stroke(Consts.COLOR_TEXT_LEVEL3);
  line(firstX, height-40, lastX, height-40);
  line(firstX, height-45, firstX, height-35);
  line(secX, height-45, secX, height-35);
  line(lastX, height-45, lastX, height-35);

  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text(firstYear, firstX, height-20);
  text(secYear, secX, height-20);
  text(lastYear, lastX, height-20);

  textAlign(LEFT);
  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text("*Passe com o rato por cima dos circulos\npara obter mais informação!",30,height-45);
}

void drawYearRegionalScreen(Integer menuId) {
  textAlign(CENTER);
  textFont(robotoRegular22,22);
  fill(Consts.COLOR_TEXT_LEVEL1);
  text("Incêndios em Portugal\n"+viewportShowYear+" - Distritos", 640, 30);

  toggleMapView.show();

  textFont(robotoRegular14,14);
  if (seeFires) {
    fill(Consts.COLOR_1);
    text("Total de Fogos", width-280, 80);
    fill(Consts.COLOR_GRAY2);
    text("Área Ardida", width-105, 80);
  } else {
    fill(Consts.COLOR_GRAY2);
    text("Total de Fogos", width-280, 80);
    fill(Consts.COLOR_1);
    text("Área Ardida", width-105, 80);
  }
  Year y = years.get(viewportShowYear);
  float districtMaxFires = y.getMaxDistrictFires();

  float districtMaxBurnedArea = y.getMaxDistrictBurnedArea();

  for (HashMap.Entry<String, PVector[]> entry : districtMap.entrySet()) {
    String district = entry.getKey();
    District d = (District) y.getDistrict(district);

    PVector[] vertices = entry.getValue();

    if (seeFires) {
      float t = map(d.getOriginalFires(), 0, districtMaxFires, 40, 255);
      fill(Consts.COLOR_FIRE, int(t));
    } else {
      float t = map(d.getOriginalBurnedArea(), 0, districtMaxBurnedArea, 40, 255);
      fill(Consts.COLOR_BURNED_AREA, int(t));
    }
    stroke(255);

    beginShape();
    for (PVector v : vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

    if (containsPoint(vertices, mouseX, mouseY)) {
      textFont(robotoRegular16,16);
      d.drawDistrictInfo(width/2, height/2);
    }
  }

  yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, 14, robotoRegular14);
  drawYearScreensButtons(menuId);

  textAlign(LEFT);
  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text("*Passe com o rato por cima do mapa\npara obter mais informação!",30,height-45);
}

void drawYearTypeScreen(Integer menuId) {
  textAlign(CENTER);
  textFont(robotoRegular22,22);
  fill(Consts.COLOR_TEXT_LEVEL1);
  text("Incêndios em Portugal\n"+viewportShowYear+" - Tipos de Incêndios", 640, 30);

  Year y = (Year) years.get(viewportShowYear);
  HashMap<String, Type> yearTypes = y.getTypes();
  pieChart(yearTypes, width/2, height/2, true);

  drawYearScreensButtons(menuId);

  textAlign(LEFT);
  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text("*Passe com o rato por cima do gráfico\npara obter mais informação!",30,height-45);
}

void drawYearCausesScreen(Integer menuId) {
  textAlign(CENTER);
  textFont(robotoRegular22,22);
  fill(Consts.COLOR_TEXT_LEVEL1);
  text("Incêndios em Portugal\n"+viewportShowYear+" - Causas de Incêndios", 640, 30);

  Year y = (Year) years.get(viewportShowYear);
  HashMap<String, Type> yearCauses = y.getCauses();
  pieChart(yearCauses, width/2, height/2, true);

  drawYearScreensButtons(menuId);

  textAlign(LEFT);
  textFont(robotoRegular12,12);
  fill(Consts.COLOR_TEXT_LEVEL3);
  text("*Passe com o rato por cima do gráfico\npara obter mais informação!",30,height-45);
}

void drawYearStatisticsScreen(Integer menuId) {
  textAlign(CENTER);
  textFont(robotoRegular22,22);
  fill(Consts.COLOR_TEXT_LEVEL1);
  text("Incêndios em Portugal\n"+viewportShowYear+" - Estatísticas", 640, 30);

  HashMap<String, Float> totalFires = new HashMap<String, Float>();
  HashMap<String, Float> totalBurnedArea = new HashMap<String, Float>();

  HashMap<String, String> maxDistrictNameFires = new HashMap<String, String>();
  HashMap<String, String> maxDistrictNameBurnedArea = new HashMap<String, String>();

  HashMap<String, String> maxTypeNameTotalFires = new HashMap<String, String>();
  HashMap<String, String> maxTypeNameTotalBurnedArea = new HashMap<String, String>();

  HashMap<String, String> maxCauseNameTotalFires = new HashMap<String, String>();
  HashMap<String, String> maxCauseNameTotalBurnedArea = new HashMap<String, String>();

  Float maxTotalFiresAllYears = 0.0;
  Float maxTotalBurnedAreaAllYears = 0.0;

  for (Map.Entry<String, Year> year : years.entrySet()) {
    Year ano = year.getValue();

    totalFires.put(ano.getName(), ano.originalFires);
    totalBurnedArea.put(ano.getName(), ano.originalBurnedArea);

    if (maxTotalFiresAllYears < ano.originalFires) {
      maxTotalFiresAllYears = ano.originalFires;
    }
    if (maxTotalBurnedAreaAllYears < ano.originalBurnedArea) {
      maxTotalBurnedAreaAllYears = ano.originalBurnedArea;
    }

    maxDistrictNameFires.put(ano.getName(), ano.getMaxDistrictNameFires());
    maxDistrictNameBurnedArea.put(ano.getName(), ano.getMaxDistrictNameBurnedArea());

    maxTypeNameTotalFires.put(ano.getName(), ano.getMaxTypeNameFires());
    maxTypeNameTotalBurnedArea.put(ano.getName(), ano.getMaxTypeNameBurnedArea());

    maxCauseNameTotalFires.put(ano.getName(), ano.getMaxCausesNameFires());
    maxCauseNameTotalBurnedArea.put(ano.getName(), ano.getMaxCausesNameBurnedArea());
  }

  fill(Consts.COLOR_TEXT_LEVEL3);
  textFont(robotoRegular14,14);
  textAlign(RIGHT);
  Integer YReferencia = 160;
  text("Total de Fogos:", menuWidth+250, YReferencia);
  text("Total de Área Ardida:", menuWidth+250, YReferencia+40);

  stroke(Consts.COLOR_GRAY3);
  line(menuWidth, YReferencia+75, menuWidth+820, YReferencia+75);

  fill(Consts.COLOR_TEXT_LEVEL3);
  text("Distrito com maior Total Fogos:", menuWidth+250, YReferencia+115);
  text("Distrito com maior Área Ardida:", menuWidth+250, YReferencia+155);
  text("Tipo com maior Total Fogos:", menuWidth+250, YReferencia+210);
  text("Tipo com maior Área Ardida:", menuWidth+250, YReferencia+250);
  text("Causa com maior Total Fogos:", menuWidth+250, YReferencia+305);
  text("Causa com maior Área Ardida:", menuWidth+250, YReferencia+345);

  // volto a colocar o texto pequeno
  textFont(robotoRegular12,12);
  textAlign(LEFT);

  // GRAFICOS:
  Integer Barras_XReferencia = menuWidth+270;
  Integer TextosDasBarras_XReferencia = menuWidth+290;
  Integer LarguraDasBarras = 550;
  Integer AlturaDasBarras = 20;
  // Total de Fogos
  ////Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia-1, YReferencia-15, 551, AlturaDasBarras+1);

  ////Barra Dianteira
  float sSelecionado = map(totalFires.get(viewportShowYear), 0, maxTotalFiresAllYears, 0, LarguraDasBarras);
  Ani.to(this, 0.6, "animTamanhoGrafico1", sSelecionado);
  noStroke();
  fill(Consts.COLOR_GRAY1);
  rect(Barras_XReferencia, YReferencia-14, animTamanhoGrafico1, AlturaDasBarras);

  ////Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(int(totalFires.get(viewportShowYear)) + " fogos", TextosDasBarras_XReferencia, YReferencia);

  // Total de Área Ardida
  ////Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+25, 551, AlturaDasBarras+1);

  ////Barra Dianteira
  sSelecionado = map(totalBurnedArea.get(viewportShowYear), 0, maxTotalBurnedAreaAllYears, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico2", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+26, animTamanhoGrafico2, AlturaDasBarras);

  ////Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(totalBurnedArea.get(viewportShowYear) + " ha", TextosDasBarras_XReferencia, YReferencia+40);
  
  Year year = (Year) years.get(viewportShowYear);

  // Distrito com maior Total de fogos
  // Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+100, 551, AlturaDasBarras+1);

  // Barra Dianteira
  Float percentagemTotalFogosMaiorDistrito = (year.getDistrict(maxDistrictNameFires.get(viewportShowYear)).getOriginalFires()/year.getOriginalFires())*100;
  sSelecionado = map(percentagemTotalFogosMaiorDistrito, 0, 100, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico3", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+101, animTamanhoGrafico3, AlturaDasBarras);

  // Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(maxDistrictNameFires.get(viewportShowYear) + " - " + int(percentagemTotalFogosMaiorDistrito) + "%", TextosDasBarras_XReferencia, YReferencia+115);

  // Distrito com maior Total de Área Ardida
  // Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+140, 551, AlturaDasBarras+1);

  // Barra Dianteira
  Float percentagemAreaArdidaMaiorDistrito = (year.getDistrict(maxDistrictNameBurnedArea.get(viewportShowYear)).getOriginalBurnedArea()/year.getOriginalBurnedArea())*100;
  sSelecionado = map(percentagemAreaArdidaMaiorDistrito, 0, 100, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico4", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+141, animTamanhoGrafico4, AlturaDasBarras);

  // Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(maxDistrictNameBurnedArea.get(viewportShowYear) + " - " + int(percentagemAreaArdidaMaiorDistrito) + "%", TextosDasBarras_XReferencia, YReferencia+155);


  // Tipo com maior Total Fogos
  // Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+195, 551, AlturaDasBarras+1);

  //Barra Dianteira
  Float percentagemTipoMaiorTotalFogos = (year.getType(maxTypeNameTotalFires.get(viewportShowYear)).getFires()/year.getOriginalFires())*100;
  sSelecionado = map(percentagemTipoMaiorTotalFogos, 0, 100, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico5", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+196, animTamanhoGrafico5, AlturaDasBarras);

  //Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(maxTypeNameTotalFires.get(viewportShowYear) + " - " + int(percentagemTipoMaiorTotalFogos) + "%", TextosDasBarras_XReferencia, YReferencia+210);


  // Distrito com maior Total de Área Ardida
  // Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+235, 551, AlturaDasBarras+1);

  // Barra Dianteira
  Float percentagemTipoMaiorTotalAreaArdida = (year.getType(maxTypeNameTotalBurnedArea.get(viewportShowYear)).getBurnedArea()/year.getOriginalBurnedArea())*100;
  sSelecionado = map(percentagemTipoMaiorTotalAreaArdida, 0, 100, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico6", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+236, animTamanhoGrafico6, AlturaDasBarras);

  // Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(maxTypeNameTotalBurnedArea.get(viewportShowYear) + " - " + int(percentagemTipoMaiorTotalAreaArdida) + "%", TextosDasBarras_XReferencia, YReferencia+250);

  // Causa com maior Total Fogos
  // Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+290, 551, AlturaDasBarras+1);

  // Barra Dianteira
  Float percentagemCausaMaiorTotalFogos = (year.getCause(maxCauseNameTotalFires.get(viewportShowYear)).getFires()/year.getOriginalFires())*100;
  sSelecionado = map(percentagemCausaMaiorTotalFogos, 0, 100, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico7", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+291, animTamanhoGrafico7, AlturaDasBarras);

  // Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(maxCauseNameTotalFires.get(viewportShowYear) + " - " + int(percentagemCausaMaiorTotalFogos) + "%", TextosDasBarras_XReferencia, YReferencia+305);

  // Causa com maior Total de Área Ardida
  // Barra Traseira
  stroke(Consts.COLOR_TEXT_LEVEL1);
  strokeWeight(1);
  fill(255);
  rect(Barras_XReferencia - 1, YReferencia+330, 551, AlturaDasBarras+1);

  // Barra Dianteira
  Float percentagemCausaMaiorTotalAreaArdida = (year.getCause(maxCauseNameTotalBurnedArea.get(viewportShowYear)).getBurnedArea()/year.getOriginalBurnedArea())*100;
  sSelecionado = map(percentagemCausaMaiorTotalAreaArdida, 0, 100, 0, LarguraDasBarras);
  fill(Consts.COLOR_GRAY1);
  Ani.to(this, 0.6, "animTamanhoGrafico8", sSelecionado);
  noStroke();
  rect(Barras_XReferencia, YReferencia+331, animTamanhoGrafico8, AlturaDasBarras);

  // Texto Dentro da Barra
  fill(Consts.COLOR_TEXT_LEVEL1);
  text(maxCauseNameTotalBurnedArea.get(viewportShowYear) + " - " + int(percentagemCausaMaiorTotalAreaArdida) + "%", TextosDasBarras_XReferencia, YReferencia+345);

  drawYearScreensButtons(menuId);
}

void drawYearScreensButtons(Integer menuId) {
  textAlign(LEFT);
  yearShowDistricts.update();
  yearsShowType.update();
  yearsShowCause.update();
  yearsShowStats.update();

  if (yearShowDistricts.clicked) {
    yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowType = new Button(450, height-60, 120, 40, "TIPOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowCause = new Button(600, height-60, 120, 40, "CAUSAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowStats = new Button(750, height-60, 120, 40, "ESTATÍSTICAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    sectionView = Integer.parseInt(menuId+"1");
    navigationHistory.add(sectionView);
  }

  if (yearsShowType.clicked) {
    yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowType = new Button(450, height-60, 120, 40, "TIPOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowCause = new Button(600, height-60, 120, 40, "CAUSAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowStats = new Button(750, height-60, 120, 40, "ESTATÍSTICAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    sectionView = Integer.parseInt(menuId+"2");
    navigationHistory.add(sectionView);
  }

  if (yearsShowCause.clicked) {
    yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowType = new Button(450, height-60, 120, 40, "TIPOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowCause = new Button(600, height-60, 120, 40, "CAUSAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowStats = new Button(750, height-60, 120, 40, "ESTATÍSTICAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    sectionView = Integer.parseInt(menuId+"3");
    navigationHistory.add(sectionView);
  }

  if (yearsShowStats.clicked) {
    yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowType = new Button(450, height-60, 120, 40, "TIPOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowCause = new Button(600, height-60, 120, 40, "CAUSAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    yearsShowStats = new Button(750, height-60, 120, 40, "ESTATÍSTICAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
    sectionView = Integer.parseInt(menuId+"4");
    navigationHistory.add(sectionView);
  }
}

void resetYearScreensButtons() {
  yearShowDistricts = new Button(300, height-60, 120, 40, "DISTRITOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
  yearsShowType = new Button(450, height-60, 120, 40, "TIPOS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
  yearsShowCause = new Button(600, height-60, 120, 40, "CAUSAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
  yearsShowStats = new Button(750, height-60, 120, 40, "ESTATÍSTICAS", Consts.COLOR_TEXT_BUTTON, Consts.COLOR_BUTTON, Consts.COLOR_BUTTON_HOVER, Consts.COLOR_BUTTON_ACTIVE, 14,robotoRegular14);
}

/* IMPORT DATA */
void importData() {
  String[] dataYear;
  Year dataYear1 = new Year();
  Year dataYear2 = new Year();
  Year dataYear3 = new Year();

  HashMap<String, District> districtsYear1 = new HashMap<String, District>();
  HashMap<String, District> districtsYear2 = new HashMap<String, District>();
  HashMap<String, District> districtsYear3 = new HashMap<String, District>();

  HashMap<String, Type> fireTypesYear1 = new HashMap<String, Type>();
  HashMap<String, Type> fireTypesYear2 = new HashMap<String, Type>();
  HashMap<String, Type> fireTypesYear3 = new HashMap<String, Type>();

  HashMap<String, Type> fireCausesYear1 = new HashMap<String, Type>();
  HashMap<String, Type> fireCausesYear2 = new HashMap<String, Type>();
  HashMap<String, Type> fireCausesYear3 = new HashMap<String, Type>();

  int totalFiresInFile = 0;
  String tempLine;
  String[] tempSplitLine;
  String name = "";
  float tempTotalValidFires = 0.0;
  float tempTotalBurnedArea = 0.0;


  // -- 2013
  dataYear = loadStrings("data-2013.csv");
  totalFiresInFile = dataYear.length;

  for (int i = 1; i < totalFiresInFile; i++) {
    tempLine = dataYear[i];

    if (isValidLine(tempLine)) {
      tempSplitLine = splitTokens(tempLine, ",");
      tempTotalValidFires++;
      name = tempSplitLine[0];
      if (!Float.isNaN(float(tempSplitLine[5]))) {
        tempTotalBurnedArea += float(tempSplitLine[5]);
      }

      String district = stripDiacritics(tempSplitLine[2]);
      if (districtsYear1.containsKey(district)) {
        districtsYear1.get(district).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        districtsYear1.put(district, new District());
        districtsYear1.get(district).updateBurnedArea(float(tempSplitLine[5]));
        districtsYear1.get(district).setName(district);
        districtsYear1.get(district).setPublicName(tempSplitLine[2]);
      }
      // type
      String type = tempSplitLine[1];
      if (fireTypesYear1.containsKey(type)) {
        fireTypesYear1.get(type).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        fireTypesYear1.put(type, new Type());
        fireTypesYear1.get(type).updateBurnedArea(float(tempSplitLine[5]));
        fireTypesYear1.get(type).setName(type);

        if (typeColors.containsType(type)) {
          fireTypesYear1.get(type).setColor(typeColors.getColorType(type));
        } else {
          Color newTypeColor = typeColors.getNextColorAvailable();
          fireTypesYear1.get(type).setColor(newTypeColor);
          typeColors.addTypeColor(type, newTypeColor);
        }
      }
      // causes
      type = tempSplitLine[6];
      if (fireCausesYear1.containsKey(type)) {
        fireCausesYear1.get(type).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        fireCausesYear1.put(type, new Type());
        fireCausesYear1.get(type).updateBurnedArea(float(tempSplitLine[5]));
        fireCausesYear1.get(type).setName(type);

        if (typeColors.containsType(type)) {
          fireCausesYear1.get(type).setColor(typeColors.getColorType(type));
        } else {
          Color newTypeColor = typeColors.getNextColorAvailable();
          fireCausesYear1.get(type).setColor(newTypeColor);
          typeColors.addTypeColor(type, newTypeColor);
        }
      }
    }
    dataYear1 = new Year(name, tempTotalValidFires, tempTotalBurnedArea, tempTotalValidFires, tempTotalBurnedArea, districtsYear1, fireTypesYear1, fireCausesYear1, 200+menuWidth, height/2 +40);
  }

  if (tempTotalValidFires > maxTotalFires) { 
    maxTotalFires = tempTotalValidFires;
  }
  if (tempTotalBurnedArea > maxTotalBurnedArea) { 
    maxTotalBurnedArea = tempTotalBurnedArea;
  }

  tempTotalValidFires = 0.0;
  tempTotalBurnedArea = 0.0;

  // -- 2014
  dataYear = loadStrings("data-2014.csv");
  totalFiresInFile = dataYear.length;

  for (int i = 1; i < totalFiresInFile; i++) {
    tempLine = dataYear[i];
    if (isValidLine(tempLine)) {
      tempSplitLine = splitTokens(tempLine, ",");
      tempTotalValidFires++;
      name = tempSplitLine[0];
      if (!Float.isNaN(float(tempSplitLine[5]))) {
        tempTotalBurnedArea += float(tempSplitLine[5]);
      }

      String district = stripDiacritics(tempSplitLine[2]);
      if (districtsYear2.containsKey(district)) {
        districtsYear2.get(district).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        districtsYear2.put(district, new District());
        districtsYear2.get(district).updateBurnedArea(float(tempSplitLine[5]));
        districtsYear2.get(district).setName(district);
        districtsYear2.get(district).setPublicName(tempSplitLine[2]);
      }
      // types
      String type = tempSplitLine[1];
      if (fireTypesYear2.containsKey(type)) {
        fireTypesYear2.get(type).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        fireTypesYear2.put(type, new Type());
        fireTypesYear2.get(type).updateBurnedArea(float(tempSplitLine[5]));
        fireTypesYear2.get(type).setName(type);
        if (causesColors.containsType(type)) {
          fireTypesYear2.get(type).setColor(causesColors.getColorType(type));
        } else {
          Color newTypeColor = causesColors.getNextColorAvailable();
          fireTypesYear2.get(type).setColor(newTypeColor);
          causesColors.addTypeColor(type, newTypeColor);
        }
      }

      // causes
      type = tempSplitLine[6];
      if (fireCausesYear2.containsKey(type)) {
        fireCausesYear2.get(type).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        fireCausesYear2.put(type, new Type());
        fireCausesYear2.get(type).updateBurnedArea(float(tempSplitLine[5]));
        fireCausesYear2.get(type).setName(type);

        if (causesColors.containsType(type)) {
          fireCausesYear2.get(type).setColor(causesColors.getColorType(type));
        } else {
          Color newTypeColor = causesColors.getNextColorAvailable();
          fireCausesYear2.get(type).setColor(newTypeColor);
          causesColors.addTypeColor(type, newTypeColor);
        }
      }
    }
    dataYear2 = new Year(name, tempTotalValidFires, tempTotalBurnedArea, tempTotalValidFires, tempTotalBurnedArea, districtsYear2, fireTypesYear2, fireCausesYear1, 450+menuWidth, height/2 + 40);
  }

  if (tempTotalValidFires > maxTotalFires) { 
    maxTotalFires = tempTotalValidFires;
  }
  if (tempTotalBurnedArea > maxTotalBurnedArea) { 
    maxTotalBurnedArea = tempTotalBurnedArea;
  }

  tempTotalValidFires = 0.0;
  tempTotalBurnedArea = 0.0;

  // -- 2015
  dataYear = loadStrings("data-2015.csv");
  totalFiresInFile = dataYear.length;

  for (int i = 1; i < totalFiresInFile; i++) {
    tempLine = dataYear[i];
    if (isValidLine(tempLine)) {
      tempSplitLine = splitTokens(tempLine, ",");
      tempTotalValidFires++;
      name = tempSplitLine[0];
      if (!Float.isNaN(float(tempSplitLine[5]))) {
        tempTotalBurnedArea += float(tempSplitLine[5]);
      }

      String district = stripDiacritics(tempSplitLine[2]);
      if (districtsYear3.containsKey(district)) {
        districtsYear3.get(district).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        districtsYear3.put(district, new District());
        districtsYear3.get(district).updateBurnedArea(float(tempSplitLine[5]));
        districtsYear3.get(district).setName(district);
        districtsYear3.get(district).setPublicName(tempSplitLine[2]);
      }

      // types
      String type = tempSplitLine[1];
      if (fireTypesYear3.containsKey(type)) {
        fireTypesYear3.get(type).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        fireTypesYear3.put(type, new Type());
        fireTypesYear3.get(type).updateBurnedArea(float(tempSplitLine[5]));
        fireTypesYear3.get(type).setName(type);
        if (typeColors.containsType(type)) {
          fireTypesYear3.get(type).setColor(typeColors.getColorType(type));
        } else {
          Color newTypeColor = typeColors.getNextColorAvailable();
          fireTypesYear3.get(type).setColor(newTypeColor);
          typeColors.addTypeColor(type, newTypeColor);
        }
      }

      // causes
      type = tempSplitLine[6];
      if (fireCausesYear3.containsKey(type)) {
        fireCausesYear3.get(type).updateBurnedArea(float(tempSplitLine[5]));
      } else {
        fireCausesYear3.put(type, new Type());
        fireCausesYear3.get(type).updateBurnedArea(float(tempSplitLine[5]));
        fireCausesYear3.get(type).setName(type);

        if (causesColors.containsType(type)) {
          fireCausesYear3.get(type).setColor(causesColors.getColorType(type));
        } else {
          Color newTypeColor = causesColors.getNextColorAvailable();
          fireCausesYear3.get(type).setColor(newTypeColor);
          causesColors.addTypeColor(type, newTypeColor);
        }
      }
    }
    dataYear3 = new Year(name, tempTotalValidFires, tempTotalBurnedArea, tempTotalValidFires, tempTotalBurnedArea, districtsYear3, fireTypesYear3, fireCausesYear3, 700+menuWidth, height/2 + 40);
  }

  if (tempTotalValidFires > maxTotalFires) { 
    maxTotalFires = tempTotalValidFires;
  }
  if (tempTotalBurnedArea > maxTotalBurnedArea) { 
    maxTotalBurnedArea = tempTotalBurnedArea;
  }


  // Map values
  dataYear1.setFires(map(dataYear1.getFires(), 0, maxTotalFires, 0, 100));
  dataYear2.setFires(map(dataYear2.getFires(), 0, maxTotalFires, 0, 100));
  dataYear3.setFires(map(dataYear3.getFires(), 0, maxTotalFires, 0, 100));

  dataYear1.setBurnedArea(map(dataYear1.getBurnedArea(), 0, maxTotalBurnedArea, 0, 380));
  dataYear2.setBurnedArea(map(dataYear2.getBurnedArea(), 0, maxTotalBurnedArea, 0, 380));
  dataYear3.setBurnedArea(map(dataYear3.getBurnedArea(), 0, maxTotalBurnedArea, 0, 380));


  float districtMaxFires = 0.0;
  float districtMaxBurnedArea = 0.0;

  String districtNameMaxFires = "";
  String districtNameMaxBurnedArea = ""; 

  for (Map.Entry d : districtsYear1.entrySet()) {
    District dis = (District) d.getValue();
    if (dis.getFires() > districtMaxFires) {
      districtMaxFires = dis.getFires();
      districtNameMaxFires = dis.getPublicName();
    }
    if (dis.getBurnedArea() > districtMaxBurnedArea) {
      districtMaxBurnedArea = dis.getBurnedArea();
      districtNameMaxBurnedArea = dis.getPublicName();
    }
  }

  dataYear1.setMaxDistrictFires(districtMaxFires);
  dataYear1.setMaxDistrictBurnedArea(districtMaxBurnedArea);
  dataYear1.setMaxDistrictNameFires(districtNameMaxFires);
  dataYear1.setMaxDistrictNameBurnedArea(districtNameMaxBurnedArea);

  districtMaxFires = 0.0;
  districtMaxBurnedArea = 0.0; 

  districtNameMaxFires = "";
  districtNameMaxBurnedArea = "";

  for (Map.Entry d : districtsYear2.entrySet()) {
    District dis = (District) d.getValue();
    if (dis.getFires() > districtMaxFires) {
      districtMaxFires = dis.getFires();
      districtNameMaxFires = dis.getPublicName();
    }
    if (dis.getBurnedArea() > districtMaxBurnedArea) {
      districtMaxBurnedArea = dis.getBurnedArea();
      districtNameMaxBurnedArea = dis.getPublicName();
    }
  }
  dataYear2.setMaxDistrictFires(districtMaxFires);
  dataYear2.setMaxDistrictBurnedArea(districtMaxBurnedArea);
  dataYear2.setMaxDistrictNameFires(districtNameMaxFires);
  dataYear2.setMaxDistrictNameBurnedArea(districtNameMaxBurnedArea);

  districtMaxFires = 0.0;
  districtMaxBurnedArea = 0.0; 

  districtNameMaxFires = "";
  districtNameMaxBurnedArea = "";

  for (Map.Entry d : districtsYear3.entrySet()) {
    District dis = (District) d.getValue();
    if (dis.getFires() > districtMaxFires) {
      districtMaxFires = dis.getFires();
      districtNameMaxFires = dis.getPublicName();
    }
    if (dis.getBurnedArea() > districtMaxBurnedArea) {
      districtMaxBurnedArea = dis.getBurnedArea();
      districtNameMaxBurnedArea = dis.getPublicName();
    }
  }
  dataYear3.setMaxDistrictFires(districtMaxFires);
  dataYear3.setMaxDistrictBurnedArea(districtMaxBurnedArea);
  dataYear3.setMaxDistrictNameFires(districtNameMaxFires);
  dataYear3.setMaxDistrictNameBurnedArea(districtNameMaxBurnedArea);

  // find max type values
  float typeMaxFires = 0.0;
  float typeMaxBurnedArea = 0.0; 
  String typeNameMaxFires = "";
  String typeNameMaxBurnedArea = ""; 

  for (Map.Entry tp : fireTypesYear1.entrySet()) {
    Type t = (Type) tp.getValue();
    if (t.getFires() > typeMaxFires) {
      typeMaxFires = t.getFires();
      typeNameMaxFires = t.getName();
    }
    if (t.getBurnedArea() > typeMaxBurnedArea) {
      typeMaxBurnedArea = t.getBurnedArea();
      typeNameMaxBurnedArea = t.getName();
    }
  }
  dataYear1.setMaxTypeFires(typeMaxFires);
  dataYear1.setMaxTypeBurnedArea(typeMaxBurnedArea);
  dataYear1.setMaxTypeNameFires(typeNameMaxFires);
  dataYear1.setMaxTypeNameBurnedArea(typeNameMaxBurnedArea);

  typeMaxFires = 0.0;
  typeMaxBurnedArea = 0.0; 
  typeNameMaxFires = "";
  typeNameMaxBurnedArea = ""; 
  for (Map.Entry tp : fireTypesYear2.entrySet()) {
    Type t = (Type) tp.getValue();
    if (t.getFires() > typeMaxFires) {
      typeMaxFires = t.getFires();
      typeNameMaxFires = t.getName();
    }
    if (t.getBurnedArea() > typeMaxBurnedArea) {
      typeMaxBurnedArea = t.getBurnedArea();
      typeNameMaxBurnedArea = t.getName();
    }
  }
  dataYear2.setMaxTypeFires(typeMaxFires);
  dataYear2.setMaxTypeBurnedArea(typeMaxBurnedArea);
  dataYear2.setMaxTypeNameFires(typeNameMaxFires);
  dataYear2.setMaxTypeNameBurnedArea(typeNameMaxBurnedArea);

  typeMaxFires = 0.0;
  typeMaxBurnedArea = 0.0; 
  typeNameMaxFires = "";
  typeNameMaxBurnedArea = ""; 
  for (Map.Entry tp : fireTypesYear3.entrySet()) {
    Type t = (Type) tp.getValue();
    if (t.getFires() > typeMaxFires) {
      typeMaxFires = t.getFires();
      typeNameMaxFires = t.getName();
    }
    if (t.getBurnedArea() > typeMaxBurnedArea) {
      typeMaxBurnedArea = t.getBurnedArea();
      typeNameMaxBurnedArea = t.getName();
    }
  }
  dataYear3.setMaxTypeFires(typeMaxFires);
  dataYear3.setMaxTypeBurnedArea(typeMaxBurnedArea);
  dataYear3.setMaxTypeNameFires(typeNameMaxFires);
  dataYear3.setMaxTypeNameBurnedArea(typeNameMaxBurnedArea);

  // find max causes values
  typeMaxFires = 0.0;
  typeMaxBurnedArea = 0.0; 
  typeNameMaxFires = "";
  typeNameMaxBurnedArea = ""; 

  for (Map.Entry tp : fireCausesYear1.entrySet()) {
    Type t = (Type) tp.getValue();
    if (t.getFires() > typeMaxFires) {
      typeMaxFires = t.getFires();
      typeNameMaxFires = t.getName();
    }
    if (t.getBurnedArea() > typeMaxBurnedArea) {
      typeMaxBurnedArea = t.getBurnedArea();
      typeNameMaxBurnedArea = t.getName();
    }
  }
  dataYear1.setMaxCausesFires(typeMaxFires);
  dataYear1.setMaxCausesBurnedArea(typeMaxBurnedArea);
  dataYear1.setMaxCausesNameFires(typeNameMaxFires);
  dataYear1.setMaxCausesNameBurnedArea(typeNameMaxBurnedArea);

  typeMaxFires = 0.0;
  typeMaxBurnedArea = 0.0; 
  typeNameMaxFires = "";
  typeNameMaxBurnedArea = ""; 
  for (Map.Entry tp : fireCausesYear2.entrySet()) {
    Type t = (Type) tp.getValue();
    if (t.getFires() > typeMaxFires) {
      typeMaxFires = t.getFires();
      typeNameMaxFires = t.getName();
    }
    if (t.getBurnedArea() > typeMaxBurnedArea) {
      typeMaxBurnedArea = t.getBurnedArea();
      typeNameMaxBurnedArea = t.getName();
    }
  }
  dataYear2.setMaxCausesFires(typeMaxFires);
  dataYear2.setMaxCausesBurnedArea(typeMaxBurnedArea);
  dataYear2.setMaxCausesNameFires(typeNameMaxFires);
  dataYear2.setMaxCausesNameBurnedArea(typeNameMaxBurnedArea);

  typeMaxFires = 0.0;
  typeMaxBurnedArea = 0.0; 
  typeNameMaxFires = "";
  typeNameMaxBurnedArea = ""; 
  for (Map.Entry tp : fireCausesYear3.entrySet()) {
    Type t = (Type) tp.getValue();
    if (t.getFires() > typeMaxFires) {
      typeMaxFires = t.getFires();
      typeNameMaxFires = t.getName();
    }
    if (t.getBurnedArea() > typeMaxBurnedArea) {
      typeMaxBurnedArea = t.getBurnedArea();
      typeNameMaxBurnedArea = t.getName();
    }
  }
  dataYear3.setMaxCausesFires(typeMaxFires);
  dataYear3.setMaxCausesBurnedArea(typeMaxBurnedArea);
  dataYear3.setMaxCausesNameFires(typeNameMaxFires);
  dataYear3.setMaxCausesNameBurnedArea(typeNameMaxBurnedArea);


  // map the values
  for (Map.Entry d : districtsYear1.entrySet()) {
    District dis = (District) d.getValue();
    dis.setFires(map(dis.getFires(), 0, dataYear1.getMaxDistrictFires(), 0, 100));
    dis.setBurnedArea(map(dis.getBurnedArea(), 0, dataYear1.getMaxDistrictBurnedArea(), 0, 380));
  }
  for (Map.Entry d : districtsYear2.entrySet()) {
    District dis = (District) d.getValue();
    dis.setFires(map(dis.getFires(), 0, dataYear2.getMaxDistrictFires(), 0, 100));
    dis.setBurnedArea(map(dis.getBurnedArea(), 0, dataYear2.getMaxDistrictBurnedArea(), 0, 380));
  }
  for (Map.Entry d : districtsYear3.entrySet()) {
    District dis = (District) d.getValue();
    dis.setFires(map(dis.getFires(), 0, dataYear3.getMaxDistrictFires(), 0, 100));
    dis.setBurnedArea(map(dis.getBurnedArea(), 0, dataYear3.getMaxDistrictBurnedArea(), 0, 380));
  }

  dataYear1.setDistricts(districtsYear1);
  dataYear2.setDistricts(districtsYear2);
  dataYear3.setDistricts(districtsYear3);

  dataYear1.setTypes(fireTypesYear1);
  dataYear2.setTypes(fireTypesYear2);
  dataYear3.setTypes(fireTypesYear3);

  dataYear1.setCauses(fireCausesYear1);
  dataYear2.setCauses(fireCausesYear2);
  dataYear3.setCauses(fireCausesYear3);

  years.put(dataYear1.getName(), dataYear1);
  years.put(dataYear2.getName(), dataYear2);
  years.put(dataYear3.getName(), dataYear3);
}

/* IMPORT PORTUGAL MAP */
void importPortugalMap() {
  String[] linhas =  loadStrings("portugal-map.csv");

  for (int i=0; i < linhas.length; i++) {
    String[] tempSplitLinhas = split(linhas[i], ',');
    ArrayList<PVector> vectors = new ArrayList<PVector>();
    districtName = stripDiacritics(tempSplitLinhas[0]);

    for (int j=1; j < tempSplitLinhas.length-1; j++) {
      String[] vectorTemp = split(tempSplitLinhas[j], ' ');
      vectors.add(new PVector(float(vectorTemp[0])+(width-550), float(vectorTemp[1])+40));
    }

    vectorArray = new PVector[vectors.size()];
    int j = 0;
    for (PVector v : vectors) {  
      vectorArray[j] = v;
      j++;
    }
    districtMap.put(districtName, vectorArray);
  }
}

/* CHECK IF DATA LINE IS VALID */
boolean isValidLine(String line) {
  String[] splitLine = splitTokens(line, ",");
  return splitLine[0] != null && !splitLine[0].isEmpty() && 
    splitLine[2] != null && !splitLine[2].isEmpty() &&
    splitLine.length == 7;
}

/* DRAWS THE LIST OF VERTICES AND RETURNS TRUE/FALSE IF THE MOUSE IS HOVER THE DISTRICT */
boolean containsPoint(PVector[] verts, float px, float py) {
  int num = verts.length;
  int i, j = num - 1;
  boolean oddNodes = false;
  for (i = 0; i < num; i++) {
    PVector vi = verts[i];
    PVector vj = verts[j];
    if (vi.y < py && vj.y >= py || vj.y < py && vi.y >= py) {
      if (vi.x + (py - vi.y) / (vj.y - vi.y) * (vj.x - vi.x) < px) {
        oddNodes = !oddNodes;
      }
    }
    j = i;
  }
  return oddNodes;
}

/* FUNCTION TO CONTROLP5 TOGGLE SWITCH */
void toggleFires(boolean theFlag) {
  if (theFlag==true) {
    seeFires = true;
  } else {
    seeFires = false;
  }
}

/* FUNCTION TO DRAW THE PIE CHART */
void pieChart(HashMap<String, Type> yearTypes, int xx, int yy, boolean graphLabels) {
  noStroke();

  float total = 0;
  float maxDiameter = 0;
  float lastAngle= -PI;
  float mouseAngle = atan2(mouseY-yy, mouseX-xx);

  for (Map.Entry yts : yearTypes.entrySet()) {
    Type yt = (Type) yts.getValue();
    total += yt.getFires();
    if (yt.getBurnedArea() > maxDiameter)
      maxDiameter = yt.getBurnedArea();
  }

  int i = 0;
  for (Map.Entry yts : yearTypes.entrySet()) {
    Type yt = (Type) yts.getValue();
    float angle = map(yt.getFires(), 0, total, 0, 2*PI);
    float d = map(yt.getBurnedArea(), 0, maxDiameter, 100, 500);

    boolean nearCenter = sqrt(sq(mouseX - xx) + sq(mouseY - yy)) <= d /2;
    fill(yt.getColor());
    if ( mouseAngle >= lastAngle && mouseAngle < lastAngle+angle && nearCenter) {
      textFont(robotoRegular16,16);
      yt.drawInfo(xx+400, yy-200);
      fill(yt.getColor());
    }
    arc(xx, yy, d, d, lastAngle, lastAngle+angle, PIE);
    lastAngle += angle;

    if (graphLabels) {
      /* Draw labels */
      fill(yt.getColor());
      rect(xx+400, yy+100+(i*25), 20, 20);
      fill(Consts.COLOR_TEXT_LEVEL1);
      textAlign(LEFT);
      textFont(robotoRegular14,14);
      text(yt.getName(), xx+425, yy+(i*25)+116);
      i++;
    }
  }
}

// --------------------------------------------------------------------------

void resetAnimations() {
  for (Map.Entry m : years.entrySet()) {
    Year y = (Year) m.getValue();
    y.resetAnimations();
  }
}

// ------------------- CP5 ---------------------------------------------------
void drawMenu() {
  //Draw menu with imported data using cp5 library
  cp5 = new ControlP5(this);
  cp5.setFont(robotoRegular12);
  cp5.setColorBackground(Consts.COLOR_BUTTON);
  cp5.setColorActive(Consts.COLOR_BUTTON_ACTIVE);
  cp5.setColorForeground(Consts.COLOR_BUTTON_HOVER);

  accordion = cp5.addAccordion("dataYears");
  accordion.setMinItemHeight(menuGroupHeight*2+2);

  String title = String.format("%s a %s", years.keySet().toArray()[years.size() - 1], years.keySet().toArray()[0]);

  Group allYearsGroup = cp5.addGroup("groupNivelAnos")
    .setLabel(title)
    .setBarHeight(20)
    .setSize(100, 0);
    
 allYearsGroup.getCaptionLabel().getStyle().marginTop = 4;

  cp5.addButton("btnNivelNacional")
    .setLabel("Nivel Nacional")
    .setPosition(10, 0)
    .setSize(menuGroupWidth-10, menuGroupHeight)
    .setColorBackground(Consts.COLOR_BUTTON_ACTIVE)
    .moveTo(allYearsGroup);

  cp5.getController("btnNivelNacional").getCaptionLabel().getStyle().marginLeft = -12;
  cp5.getController("btnNivelNacional").getCaptionLabel().getStyle().marginTop = 1;
 
  Group allYearsGroupDistrital = cp5.addGroup("groupNivelDistrital")
    .setLabel("Nivel Distrital")
    .setBackgroundColor(color(255, 100))
    .setBarHeight(menuGroupHeight)
    .setWidth(menuGroupWidth-10)
    .setPosition(10, menuGroupHeight*2+2)
    .close()
    .activateEvent(true)
    .moveTo(allYearsGroup);
    
  allYearsGroupDistrital.getCaptionLabel().getStyle().marginTop = 2;

  accordion
    .setPosition(accordionPosX, accordionPosY)
    .setWidth(menuGroupWidth)
    .addItem(allYearsGroup);

  int iteratorPosition=0;
  for (Map.Entry<String, Year> year : years.entrySet()) {
    Year ano = year.getValue();

    cp5.addButton("btn"+year.getKey())
      .setLabel(year.getValue().getName())
      .setSize(menuGroupWidth, menuGroupHeight);

    cp5.getController("btn"+year.getKey()).getCaptionLabel().getStyle().marginLeft = -52;
    cp5.getController("btn"+year.getKey()).getCaptionLabel().getStyle().marginTop = 1;

    if (iteratorPosition == 0) {
      Map<String, District> map = new TreeMap<String, District>(ano.getDistricts());
      Set set = map.entrySet();
      Iterator iterator = set.iterator();
      while (iterator.hasNext()) {
        Map.Entry dis = (Map.Entry)iterator.next();
        String btnName = ((String) dis.getKey()).toUpperCase().replaceAll("\\s+", "");
        cp5.addButton("btn" + btnName)
          .setLabel(((District) dis.getValue()).getPublicName())
          .setPosition(10, menuGroupHeight*iteratorPosition)
          .setSize(menuGroupWidth-20, menuGroupHeight)
          .moveTo(allYearsGroupDistrital);
         
         cp5.getController("btn" + btnName).getCaptionLabel().getStyle().marginTop = 1;

        iteratorPosition ++;
      }
    }
  }

  moveYearBtnsToCorrectPosY(true, false, 0);

  accordion.open(0);
  accordion.setCollapseMode(Accordion.SINGLE);
}

void controlEvent(ControlEvent theEvent) {
  if (theEvent.isGroup()) {
    int districtsCount = years.get(years.keySet().toArray()[0]).getDistricts().size();

    if (theEvent.getGroup().getName() == "groupNivelAnos" && theEvent.getGroup().isOpen()) {
      moveYearBtnsToCorrectPosY(true, false, districtsCount);
    } else if (theEvent.getGroup().getName() == "groupNivelAnos" && !theEvent.getGroup().isOpen()) {
      cp5.getGroup("groupNivelDistrital").close();
      moveYearBtnsToCorrectPosY(false, false, districtsCount);
    } else if (theEvent.getGroup().getName() == "groupNivelDistrital" && !theEvent.getGroup().isOpen()) {
      moveYearBtnsToCorrectPosY(true, false, districtsCount);
    } else if (theEvent.getGroup().getName() == "groupNivelDistrital" && theEvent.getGroup().isOpen()) {
      accordion.setItemHeight((menuGroupHeight+2) * districtsCount);

      moveYearBtnsToCorrectPosY(true, true, districtsCount);
    }
  }

  if (theEvent.isController()) {
    boolean menuButtonclicked = true;
    resetAnimations();
    switch (theEvent.getName()) {
    case "btnNivelNacional":
      sectionView = 100;
      navigationHistory.add(sectionView);
      break;
    case "btnAVEIRO":
      sectionView = 1000;
      navigationHistory.add(sectionView);
      break;
    case "btnBEJA":
      sectionView = 1001;
      navigationHistory.add(sectionView);
      break;
    case "btnBRAGA":
      sectionView = 1002;
      navigationHistory.add(sectionView);
      break;
    case "btnBRAGANCA":
      sectionView = 1003;
      navigationHistory.add(sectionView);
      break;
    case "btnCASTELOBRANCO":
      sectionView = 1004;
      navigationHistory.add(sectionView);
      break;
    case "btnCOIMBRA":
      sectionView = 1005;
      navigationHistory.add(sectionView);
      break;
    case "btnEVORA":
      sectionView = 1006;
      navigationHistory.add(sectionView);
      break;
    case "btnFARO":
      sectionView = 1007;
      navigationHistory.add(sectionView);
      break;
    case "btnGUARDA":
      sectionView = 1008;
      navigationHistory.add(sectionView);
      break;
    case "btnLEIRIA":
      sectionView = 1009;
      navigationHistory.add(sectionView);
      break;
    case "btnLISBOA":
      sectionView = 1010;
      navigationHistory.add(sectionView);
      break;
    case "btnPORTALEGRE":
      sectionView = 1011;
      navigationHistory.add(sectionView);
      break;
    case "btnPORTO":
      sectionView = 1012;
      navigationHistory.add(sectionView);
      break;
    case "btnSANTAREM":
      sectionView = 1013;
      navigationHistory.add(sectionView);
      break;
    case "btnSETUBAL":
      sectionView = 1014;
      navigationHistory.add(sectionView);
      break;
    case "btnVIANADOCASTELO":
      sectionView = 1015;
      navigationHistory.add(sectionView);
      break;
    case "btnVILAREAL":
      sectionView = 1016;
      navigationHistory.add(sectionView);
      break;
    case "btnVISEU":
      sectionView = 1017;
      navigationHistory.add(sectionView);
      break;
    case "btn2013":
      resetYearScreensButtons();
      sectionView = 21;
      navigationHistory.add(sectionView);
      break;
    case "btn2014":
      resetYearScreensButtons();
      sectionView = 31;
      navigationHistory.add(sectionView);
      break;
    case "btn2015":
      resetYearScreensButtons();    
      sectionView = 41;
      navigationHistory.add(sectionView);
      break;
    case "btn2016":
      resetYearScreensButtons();      
      sectionView = 51;
      navigationHistory.add(sectionView);
      break;
    case "btn2017":
      resetYearScreensButtons();      
      sectionView = 61;
      navigationHistory.add(sectionView);
      break;
    default :
      menuButtonclicked = false;
      break;
    }

    if (menuButtonclicked) {
      setActive(theEvent);
    }
  }
}

private void setActive(ControlEvent theEvent) {
  cp5.setColorBackground(Consts.COLOR_BUTTON);
  cp5.getController(theEvent.getName()).setColorBackground(Consts.COLOR_BUTTON_ACTIVE);
}

void moveYearBtnsToCorrectPosY(boolean yearsRangeGroupOpened, boolean districtsBarGroupOpened, int districtsCount) {
  float accordionHeightClosed = 237.8;

  int iterator=0;
  float btnPositionY=0;
  for (Map.Entry<String, Year> year : years.entrySet()) {
    if (iterator==0 && !yearsRangeGroupOpened) {
      btnPositionY = accordionPosY+menuGroupHeight+4;
    } else if (iterator>0 && !yearsRangeGroupOpened) {
      btnPositionY = btnPositionY+menuGroupHeight+2;
    } else if (iterator==0 && districtsBarGroupOpened) {
      btnPositionY = (accordionHeightClosed+(districtsCount*menuGroupHeight))+menuGroupHeight*iterator;
    } else if (iterator==0 && !districtsBarGroupOpened) {
      btnPositionY = accordionHeightClosed+menuGroupHeight*iterator;
    } else if (iterator>0 && districtsBarGroupOpened) {
      btnPositionY = (accordionHeightClosed+(districtsCount*menuGroupHeight))+((menuGroupHeight+1.8 )*iterator);
    } else {
      btnPositionY = accordionHeightClosed+((menuGroupHeight+1.8 )*iterator);
    }
    iterator++;

    cp5.getController("btn"+year.getKey())
      .setPosition(accordionPosX, btnPositionY);
  }
}

private static final Pattern DIACRITICS_AND_FRIENDS
  = Pattern.compile("[\\p{InCombiningDiacriticalMarks}\\p{IsLm}\\p{IsSk}]+");

private static String stripDiacritics(String str) {
  str = Normalizer.normalize(str, Normalizer.Form.NFD);
  str = DIACRITICS_AND_FRIENDS.matcher(str).replaceAll("");
  return str;
} 