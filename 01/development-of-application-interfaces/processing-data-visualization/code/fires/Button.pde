 /**
 *
 * Class Button, to create buttons, 
 *
 */
class Button {
  int xpos, ypos, wid, hei; // posicao x e y e tamanho H e V
  String label;    // texto do botao
  boolean over = false;
  boolean down = false; 
  boolean clicked = false;
  int fontSize;
  PFont font;

  color fillText;
  color fillButton;
  color fillButtonHover;
  color fillButtonActive;

  Button(int tx, int ty, int tw, int th, String tlabel, color fillT, color fillB, color fillBh, color fillBa, int size, PFont fnt) {
    xpos = tx;
    ypos = ty;
    wid = tw;
    hei = th;
    label = tlabel;
    fillText = fillT;
    fillButton = fillB;
    fillButtonHover = fillBh;
    fillButtonActive = fillBa;
    fontSize = size;
    font = fnt;
  }

  void update() {
    if (down && over && !mousePressed) {
      clicked=true;
    } else {
      clicked=false;
    }

    //UP OVER AND DOWN STATE CONTROLS
    if (mouseX>xpos && mouseY>ypos && mouseX<xpos+wid && mouseY<ypos+hei) {
      over=true;
      // cursor(HAND);
      if (mousePressed) {
        down=true;
      } else {
        down=false;
      }
    } else {
      over=false;
      //cursor(ARROW);
    }
    smooth();

    //box color controls // Cores mouse Over e Mouse down
    if (!over) {
      fill(fillButton);
    } else {
      if (!down) {
        fill(fillButtonHover);
      } else {
        fill(fillButtonActive);
      }
    }

    rect(xpos, ypos, wid, hei, 1);

    fill(fillText);
    textFont(font,fontSize);
    text(label, xpos+wid/2-(textWidth(label)/2), ypos+hei/2+(textAscent()/2));
  }
}