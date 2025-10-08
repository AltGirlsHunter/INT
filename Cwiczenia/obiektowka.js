//Zadanie 1
class KontopBankowe {
	#saldo = 0;
	getSaldo(){
		return this.#saldo;
	}

	depositAmount(amount){
		if(amount > 0){
			this.#saldo += amount;
		} 
	}

	depositAmount(amount){
		if(amount > 0 && amount <=  this.#saldo){
			this.#saldo -= amount;
		} 
	}
}


//Zadanie 2
class Osoba {
  static przedstawSie(imie, nazwisko) {
    if (imie && nazwisko) {
      return `Nazywam się ${imie} ${nazwisko}.`;
    } else if (imie) {
      return `Mam na imię ${imie}.`;
    } else {
      return "Nie podano danych.";
    }
  }
}

// Przykład
console.log(Osoba.przedstawSie("Jan"));
console.log(Osoba.przedstawSie("Jan", "Kowalski"));

//Zadanie 3
const Osoba = {
  imie: "Euzebiusz",
  przywitaj() {
    console.log(`Cześć, jestem ${this.imie}!`);
  }
};

const Uczen = Object.create(Osoba);
Uczen.oceny = [];
Uczen.dodajOcene = function(ocena) {
  this.oceny.push(ocena);
};
Uczen.srednia = function() {
  if (this.oceny.length === 0) return 0;
  return this.oceny.reduce((a, b) => a + b) / this.oceny.length;
};

// Przykład:
Uczen.imie = "Kasia";
Uczen.dodajOcene(5);
Uczen.dodajOcene(4);
Uczen.przywitaj();
console.log("Średnia ocen:", Uczen.srednia());

//Zadanie 4
class SrodekTransportu {
  constructor(nazwa) {
    if (new.target === SrodekTransportu)
      throw new Error("Nie można tworzyć obiektów klasy abstrakcyjnej!");
    this.nazwa = nazwa;
  }

  jedz() {
    throw new Error("Metoda abstrakcyjna musi być zaimplementowana!");
  }
}

class Auto extends SrodekTransportu {
  jedz() {
    console.log(`${this.nazwa} jedzie po drodze.`);
  }
}

class Samolot extends SrodekTransportu {
  jedz() {
    console.log(`${this.nazwa} leci w powietrzu.`);
  }
}

class Lodz extends SrodekTransportu {
  jedz() {
    console.log(`${this.nazwa} płynie po wodzie.`);
  }
}

// Przykład:
new Auto("Toyota").jedz();
new Samolot("Boeing").jedz();
new Lodz("Titanic").jedz();

//Zaadnie 5
class Psowate {
  dajGlos() {
    console.log("Nieznany dźwięk psowatych.");
  }
}

class Szczeniak extends Psowate {
  dajGlos() {
    console.log("Hau hau! (szczeniak)");
  }
}

class Pies extends Psowate {
  dajGlos() {
    console.log("Hau! Hau!");
  }
}

class Wilk extends Psowate {
  dajGlos() {
    console.log("Auuuuu!");
  }
}

// Przykład:
const psy = [new Psowate(), new Szczeniak(), new Pies(), new Wilk()];
psy.forEach(p => p.dajGlos());

//Zadanie 6
class Artysta {
  constructor(imie) {
    if (new.target === Artysta)
      throw new Error("Nie można tworzyć instancji klasy abstrakcyjnej!");
    this.imie = imie;
  }

  tworzDzielo() {
    throw new Error("Metoda abstrakcyjna!");
  }

  kontempluj() {
    console.log(`${this.imie} kontempluje nad sztuką...`);
  }
}

class Rzezbiarz extends Artysta {
  tworzDzielo() {
    console.log(`${this.imie} rzeźbi w marmurze.`);
  }
}

class Malarz extends Artysta {
  tworzDzielo() {
    console.log(`${this.imie} maluje obraz.`);
  }
}

class Pisarz extends Artysta {
  tworzDzielo() {
    console.log(`${this.imie} pisze powieść.`);
  }
}

// Przykład:
new Malarz("Leonardo").tworzDzielo();
new Pisarz("Mickiewicz").kontempluj();

//Zadanie 7
class Uzytkownik {
  static listaUzytkownikow = [];

  constructor(login, haslo) {
    if (!Uzytkownik.sprawdzHaslo(haslo))
      throw new Error("Hasło musi mieć min. 8 znaków, litery i cyfry!");
    this.login = login;
    this.haslo = haslo;
    Uzytkownik.listaUzytkownikow.push(this);
  }

  static sprawdzHaslo(haslo) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(haslo);
  }
}

// Przykład:
try {
  new Uzytkownik("kasia123", "haslo123");
  new Uzytkownik("admin", "admin1234");
  console.log(Uzytkownik.listaUzytkownikow);
} catch (err) {
  console.error(err.message);
}

//Zadanie 8
class KalkulatorProsty {
  static dodaj(a, b) {
    return a + b;
  }
  static odejmij(a, b) {
    return a - b;
  }
  static pomnoz(a, b) {
    return a * b;
  }
  static podziel(a, b) {
    if (b === 0) return "Nie można dzielić przez 0!";
    return a / b;
  }
}

// Przykład:
console.log(KalkulatorProsty.dodaj(5, 7));
console.log(KalkulatorProsty.podziel(10, 2));