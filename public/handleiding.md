# Looply — handleiding voor je route

## 1. API-sleutel instellen

Voor routes over wegen en paden gebruikt Looply openrouteservice. Kaartweergave, plaats zoeken, handmatig tekenen en GPX importeren werken zonder API-sleutel.

1. Open [het HeiGIT-accountdashboard](https://account.heigit.org/) van openrouteservice.
2. Maak een account aan of log in. Bevestig je e-mailadres als daarom wordt gevraagd.
3. Kopieer je Standard API key uit het dashboard.
4. Open **Instellingen → Kaarten & routing** in Looply en plak de sleutel.
5. Kies **Test verbinding**. Bij succes kies je **Opslaan**. Testen alleen slaat de sleutel niet op.

De sleutel wordt gemaskeerd weergegeven. Via het oogje kun je hem tonen; via **Verwijderen** verwijder je de opgeslagen persoonlijke sleutel. Verwijderen trekt de sleutel bij HeiGIT niet in: daarvoor gebruik je hun dashboard.

Looply bewaart de sleutel voor het huidige browsertabblad, ook na vernieuwen. Je browser kan sessies herstellen; gebruik **Verwijderen** als je de sleutel expliciet wilt wissen. De sleutel gaat via de Looply-server uitsluitend naar openrouteservice, wordt niet op de server opgeslagen en is geen onderdeel van routebackups. Als sessieopslag is geblokkeerd, blijft de sleutel alleen actief zolang de pagina open blijft; Looply meldt dit.

De verbindingstest gebruikt één aanvraag voor een vaste openbare voorbeeldroute in Heidelberg, niet je eigen locatie. Een geslaagde test bevestigt dat de sleutel op dat moment voetgangersroutes kan opvragen. Actuele limieten en verbruik staan in het dashboard. Bij een ongeldige sleutel of een bereikt quotum toont Looply een specifieke melding.

Als de beheerder al een serversleutel heeft ingesteld, is een eigen sleutel optioneel. Een opgeslagen persoonlijke sleutel heeft voor jouw aanvragen voorrang. Na verwijderen gebruikt Looply weer de eventuele serversleutel; de serversleutel wordt nooit getoond.

Officiële informatie: [HeiGIT API](https://api.heigit.org/).

## 2. Je eerste punten plaatsen

- Zet de kaart in **Route tekenen** en tik om een punt toe te voegen. Het eerste punt is je start.
- Of zoek een plaats/adres. Kies een resultaat om de kaart te centreren en daarna expliciet **Punt toevoegen**.
- Via **Kies je startpunt** of **Routepunt toevoegen** kun je coördinaten invoeren. Dit werkt ook zonder kaartklik.
- Kies **Kaart verkennen** om rond te kijken zonder nieuwe punten toe te voegen.

## 3. Welke routevorm past bij je plan?

| Optie | Wat doet Looply? | Voorbeeld |
| --- | --- | --- |
| **A naar B** | Verbindt de punten in volgorde, zonder terugweg. | Van huis via het park naar het station. |
| **Rondje** | Verbindt het laatste punt weer met de start. | Via de noordkant van het park heen en de zuidkant terug. |
| **Heen & terug** | Kopieert de geplande heenweg in omgekeerde richting terug. | 3 km naar een brug, dezelfde 3 km terug: totaal 6 km. |

### A naar B — enkele reis

Kies **A naar B**, voeg je start, eventuele tussenpunten en je eindpunt toe. Start en eind mogen verschillende locaties zijn. De afstand is alleen de volledige geplande enkele reis.

### Rondje — eindig waar je begon

Kies **Rondje** en plaats punten langs de plekken waar je wilt lopen. Looply sluit de route van het laatste punt naar het eerste punt. Die verbinding telt mee in afstand en tijd.

Plaats tussenpunten aan verschillende kanten van een gebied om een lus te maken. Met maar twee punten kan de route dezelfde weg heen en terug gebruiken. Looply stelt niet automatisch een rondje met een gewenste afstand, zoals 5 km, voor.

De sluiting gebruikt de modus van het laatste segment. Is dat berekend, dan wordt een beloopbare terugverbinding aangevraagd. Is het handmatig, dan is ook de sluiting een ongecontroleerde rechte lijn.

### Heen & terug — precies dezelfde route terug

Kies **Heen & terug** en plan alleen de heenweg. De gehele heenweg wordt omgekeerd gekopieerd. Afstand en tijd worden verdubbeld, zonder een nieuwe terugweg te berekenen. Controleer zelf eventuele richtingbeperkingen van paden.

## 4. Paden volgen of handmatig tekenen

**Volg de paden aan:** nieuwe segmenten worden via voetgangersrouting berekend. Hiervoor heb je een werkende API-sleutel en internet nodig. Dit is een voetgangersprofiel voor hardloopplanning, geen persoonlijk hardloopprofiel.

**Volg de paden uit:** nieuwe segmenten worden handmatige rechte lijnen. Ze verschijnen gestreept en zijn niet gecontroleerd op beloopbaarheid. Ze kunnen dwars door water, gebouwen of ontoegankelijk terrein gaan. Hiervoor is geen API-sleutel nodig.

De schakelaar geldt voor **nieuwe segmenten**, niet voor bestaande lijnen. Je kunt beide modi combineren. Wil je de modus van een bestaand aankomend segment wijzigen, verwijder en voeg het bijbehorende punt dan opnieuw toe met de gewenste instelling.

Een rekenfout schakelt nooit automatisch over op handmatige lijnen.

## 5. Bewerken

- **Verplaatsen:** selecteer het punt, kies Verplaatsen en tik de nieuwe positie aan. Op desktop kun je de marker ook verslepen.
- **Invoegen:** selecteer een punt in de lijst, kies Invoegen en tik op de kaart. Het nieuwe punt komt na het geselecteerde punt.
- **Volgorde:** gebruik de pijltjes omhoog en omlaag in de puntenlijst.
- **Verwijderen:** gebruik de prullenbak bij het punt.
- **Omkeren:** keert de puntvolgorde en geometrie om. Berekende routes worden waar nodig opnieuw berekend; handmatige en geïmporteerde geometrie wordt omgekeerd.
- **Ongedaan maken / opnieuw uitvoeren:** gebruik de pijlen boven de kaart. Een nieuwe bewerking wist de redo-geschiedenis.
- **Wissen:** vraagt bevestiging voor het leegmaken van je route.

Een grote verschuiving naar een beloopbaar pad moet je expliciet accepteren. Tijdens herberekening blijft de vorige route zichtbaar. Bij een fout is die lijn vervaagd en de afstand verouderd. GPX-export is dan geblokkeerd, maar je kunt het concept wel bewaren.

## 6. Afstand en tijd

De afstand wordt langs de volledige geometrie gemeten, niet alleen tussen de routepunten. Gaten tussen geïmporteerde segmenten worden niet verbonden of meegerekend.

Stel je tempo in onder **Jouw tempo**. Een route van 5 km bij 6:00 min/km duurt naar schatting 30 minuten. Stops, inspanning en hoogteverschillen worden niet persoonlijk gecorrigeerd. Bij Rondje telt de sluiting mee; bij Heen & terug telt de heenweg dubbel.

## 7. Een GPX gebruiken

Kies **GPX importeren**, selecteer het bestand en controleer naam, preview, afstand en waarschuwingen. Bij meerdere tracks kies je de gewenste track. Kies **Importeren en opslaan** en open de route daarna via **Mijn routes**.

De originele geometrie en segmentonderbrekingen blijven behouden; er wordt niet automatisch opnieuw gerouteerd. Je kunt metadata wijzigen of de route omkeren. Voor puntbewerking kies je **Maak bewerkbare kopie**. Deze kopie gebruikt een beperkte selectie routepunten, wordt opnieuw berekend en kan afwijken. Het opgeslagen origineel blijft bestaan.

Bestanden met alleen losse markeringen zijn geen complete routes. Looply bewaart die apart zonder gefingeerde verbindingslijnen. De importlimiet is 10 MiB en 100.000 punten.

## 8. Bewaren, exporteren en backups

Geef je route een naam via **Route opslaan**. Routes staan lokaal in deze browser op dit apparaat. Open, dupliceer, filter of markeer ze als favoriet via **Mijn routes**. Bewerkingen krijgen een aparte conceptversie; na herladen kun je een onopgeslagen concept herstellen.

Kies **GPX exporteren** bij een actuele route met geometrie. Op ondersteunde apparaten kun je het bestand delen; anders wordt het gedownload. Importeer het via de workflow van je sportapp of horloge. Niet ieder apparaat ondersteunt dezelfde afslagaanwijzingen. Looply synchroniseert niet rechtstreeks met je horloge.

Gebruik **Instellingen → Volledige backup downloaden** voor een JSON-backup met opgeslagen routes, metadata, routepunten en segmentmodi. GPX is geen volledige appbackup. **Backup herstellen** toont eerst een preview en voegt routes samen; bestaande routes worden niet automatisch gewist. De API-sleutel zit niet in de backup.

## 9. Op je telefoon en onderweg

Tik op het handvat van het onderste paneel om te wisselen tussen compact, halfopen en volledig. Punten verplaatsen en herordenen kan zonder slepen.

**Mijn locatie** vraagt pas na jouw actie locatietoegang. **Volgen** houdt je positie in beeld zolang de app open blijft; handmatig verschuiven van de kaart stopt het automatisch centreren. Locatie tonen is geen afslag­navigatie of activiteitopname. Achtergrondgebruik en een vergrendeld scherm bieden geen betrouwbare volgfunctie.

Kaarten, zoeken en nieuwe berekeningen vereisen internet. Kaartdata garandeert geen toegankelijk of veilig pad. Browserdata wissen kan lokale routes verwijderen: maak regelmatig een backup.
