// components/editor/contractTemplate.ts

export const contractTemplate = `
<h2>UTLEIER</h2>
<p>1.1 Navn/Firma: [UTLEIER_NAME] (Utleier)</p>
<p>1.2 Fødsels- eller organisasjonsnummer: [UTLEIER_ORGNR]</p>

<h2>LEIETAKER</h2>
<p>2.1 Navn/Firma: [LEIETAKER_NAME] (Leietaker)</p>
<p>2.2 Fødsels- eller organisasjonsnummer: [LEIETAKER_ORGNR]</p>

<h2>EIENDOMMEN</h2>
<p>3.1 Adresse: [EIENDOMMEN_ADRESSE]</p>
<p>3.2 Gnr.: [EIENDOMMEN_GNR] bnr.: [EIENDOMMEN_BNR] fnr.: [EIENDOMMEN_FNR] snr.: [EIENDOMMEN_SNR] i [EIENDOMMEN_KOMMUNE] kommune, kommunenummer [EIENDOMMEN_KOMMUNENUMMER] (Eiendommen)</p>

<h2>LEIEOBJEKTET</h2>
<p>4.1 Leieobjektet (Leieobjektet) består av påstående bygninger og anlegg, uteareal og parkeringsplasser på Eiendommen, som vist i vedlagte tegning, Bilag 2.</p>
<p>4.2 Leieobjektets bygninger utgjør totalt ca. [LEIEOBJEKTET_KVM] kvm.</p>
<p>4.3 Alle arealer er oppgitt etter NS 3940:2012. Eventuelle feil i arealangivelsene gir ikke rett til å kreve Leien justert, og medfører heller ikke noen endring av denne leieavtalens øvrige bestemmelser.</p>
<p>4.4 Før Overtakelse skal Utleier utføre eventuelle arbeider/endringer i Leieobjektet som angitt i Bilag […].</p>

<h2>LEIEPERIODEN</h2>
[LEIEPERIODE_BESKRIVELSE]

<h2>LEIEN</h2>
<p>6.1 Leien for Leieobjektet per år (Leien) utgjør NOK [BASE_RENT] (eksklusive merverdiavgift). I tillegg kommer merverdiavgift i den utstrekning vilkårene for å legge merverdiavgift på Leien er oppfylt, jf. punkt 10.</p>
<p>6.2 1/4 / 1/12 [stryk det som ikke passer] av Leien forfaller til betaling forskuddsvis den 1. i hver(t) kvartal/måned [stryk det som ikke passer] med NOK […] (eksklusive merverdiavgift).</p>
<p>6.3 Utleier utsteder faktura til Leietaker med slikt innhold som er påkrevd i henhold til gjeldende regelverk, og med opplysninger om Utleiers kontonummer for betaling av Leien. Betaling anses ikke skjedd før beløpet er mottatt på Utleiers konto.</p>
<p>6.4 Leietaker dekker alle kostnader ved Leieobjektet som anses som felleskostnader ved flere leietakere i næringsbygg, herunder kostnader som fremgår av vedlagte oversikt, jf. Bilag […], samt eventuell ikke- fradragsberettiget merverdiavgift på slike kostnader. Utleier dekker kun kostnader som uttrykkelig er angitt i denne leieavtalen.</p>
<p>6.5 Dersom utleie av eiendom i Leieperioden blir belagt med nye særlige skatter og/eller avgifter, skal Leietaker betale slike. Eiendomsskatt betales av Leietaker.</p>
<p>6.6 Ved forsinket betaling av Leien og/eller andre kostnader tilknyttet leieforholdet, svares forsinkelsesrente i henhold til lov av 17. desember 1976 nr. 100 eller lov som trer i stedet for denne. Utleier har rett til å kreve gebyr ved purring.</p>

<h2>LEIEREGULERING</h2>
<p>7.1 Leien reguleres hver [INDEXATION_DATE], i samsvar med eventuelle endringer i Statistisk Sentralbyrås konsumprisindeks, eller, hvis denne blir opphevet, annen tilsvarende offentlig indeks. Dog skal Leien ikke kunne reguleres under den Leien som ble avtalt på kontraktstidspunktet.</p>
<p>7.2 Opprinnelig kontraktsindeks er indeksen for [...]. Leieregulering baseres på utviklingen fra opprinnelig kontraktsindeks til siste kjente indeks på reguleringstidspunktet.</p>
<p>7.3 Leietaker er med dette gitt varsel om at årlig leieregulering vil finne sted.</p>
<p>7.4 Ved offentlig inngrep (prisstopp o.l.) som begrenser den leie Utleier ellers kunne tatt etter denne leieavtalen, skal den regulerte Leien løpe fra det tidspunkt og i den utstrekning det måtte være lovlig adgang til det.</p>


<h2>LEIETAKERS VIRKSOMHET</h2>
<p>8.1 Leieobjektet må kun benyttes til [BUSINESS_CATEGORY].</p>
<p>8.2 Endring av virksomheten i Leieobjektet, herunder drift av annen, beslektet virksomhet, er ikke tillatt uten Utleiers skriftlige forhåndssamtykke. Samtykke kan ikke nektes uten saklig grunn. Økt avgiftsmessig belastning for Utleier som følge av Leietakers endrede virksomhet skal anses som saklig grunn, med mindre Leietaker forplikter seg til å holde Utleier skadesløs for Utleiers tap og kostnader i samsvar med punkt 10 og stiller en – etter Utleiers oppfatning – tilfredsstillende sikkerhet for sine forpliktelser. Videre skal opprettholdelse av Eiendommens virksomhetsprofil/virksomhetssammensetning anses som saklig grunn.</p>

<h2>OVERTAKELSE/MELDING OM MANGLER</h2>
<p>9.1 Leieobjektet overtas ryddet og rengjort, og for øvrig i den stand som Leieobjektet var i ved Leietakers besiktigelse den […], og med eventuelle arbeider/endringer som beskrevet i Bilag […].</p>
<p>9.2 Utleier er ansvarlig for at Leieobjektet ved Overtakelse lovlig kan benyttes til den bruk/virksomhet som er angitt i punkt 5.1, herunder hva gjelder krav som følger av plan- og bygningsloven og privatrettslige forhold. Leietaker er selv ansvarlig for egne innrednings-, installasjons- og bygningsarbeider som etter avtale skal utføres av Leietaker. Leietaker er videre selv ansvarlig for eventuelle krav til, eller godkjennelser av, Leieobjektet/virksomheten som ikke er av bygningsteknisk eller reguleringsmessig karakter.</p>
<p>9.3 I forbindelse med Overtakelse av Leieobjektet skal det foretas overtakelsesbefaring. Fra befaringen føres protokoll som undertegnes på stedet av begge parter. Skjema for overtakelsesprotokoll er vedlagt som Bilag […].</p>
<p>9.4 Leietaker må gi skriftlig melding om skader og mangler mv. innen rimelig tid etter at Leietaker burde ha oppdaget dem. Forhold som Leietaker kjente til ved Overtakelse kan ikke senere gjøres gjeldende som mangel.</p>
<p>9.5 Ved Overtakelse skal Utleier gi Leietaker en innføring i bruk av teknisk utstyr/innretninger i Leieobjektet som skal benyttes av Leietaker. Videre skal Utleier ved Overtakelse fremlegge driftsmanualer/-instrukser for teknisk utstyr og innretninger i Leieobjektet. Leietaker skal i hele Leieperioden følge Utleiers til enhver tid gjeldende driftsmanualer/-instrukser.</p>

<!-- Add more sections here -->

<h2>FORHOLDET TIL HUSLEIELOVEN</h2>
<p>10.1 Følgende bestemmelser i husleieloven gjelder ikke: §§ 2-15, 3-5, 3-6, 3-8, 4-3, 5-4 første ledd, 5-8 første til og med fjerde ledd, 7-5, 8-4, 8-5, 8-6 annet ledd og 10-5. For øvrig er det denne leieavtalen som gjelder i de tilfeller der den har andre bestemmelser enn hva som følger av husleielovens fravikelige regler.</p>

<h2>LOVVALG OG TVISTELØSNING</h2>
<p>11.1 Denne leieavtalen reguleres av norsk rett.</p>
<p>11.2 Eiendommens verneting vedtas i alle tvister som gjelder leieavtalen.</p>

<h2>BILAG TIL LEIEAVTALEN</h2>
<p>Bilag 1: Firmaattest/legitimasjon for Utleier og Leietaker og eventuelle fullmakter</p>
<p>Bilag 2: Tegninger som viser Leieobjektet, herunder plantegninger for bygninger og situasjonstegninger for uteareal og parkeringsplasser</p>
<p>Bilag […]: [Arbeider som Utleier skal utføre i Leieobjektet før Overtakelse]</p>
<p>Bilag […]: Skjema for overtakelsesprotokoll</p>
<p>Bilag […]: Eksempler på kostnader som Leietaker dekker</p>
<p>Bilag […]: [Tegninger med spesifisering av areal som omfattes av mva.-registreringen]</p>
<p>Bilag […]: [Særskilt avtalt sikkerhetsstillelse]</p>
<p>Bilag […]: [Miljøavtale]</p>
<p>Bilag […]: [Databehandleravtale]</p>
<p>Bilag […]: Samordningsavtale for brannforebygging</p>

<h2>STED/DATO</h2>
<p>${new Date().toLocaleDateString("no-NO")}</p>

<h2>SIGNATUR</h2>
<p>Denne leieavtalen er undertegnet i to eksemplarer; hvorav Utleier og Leietaker har fått hvert sitt. Dersom leieavtalen er formidlet via eiendomsmegler er den undertegnet i tre eksemplarer; hvorav Utleier, Leietaker og eiendomsmegler har fått hvert sitt.</p>

<p>for Utleier   								for Leietaker</p>
<p>_________________________					______________________</p>
<p>[Utleiers repr.]								[Leietakers repr.]</p>
`
export const generateContractContent = (tenantDetails: any) => {
  let content = contractTemplate

  content = content.replace("[UTLEIER_NAME]", tenantDetails.contracts[0]?.landlordName || "")
  content = content.replace("[UTLEIER_ORGNR]", tenantDetails.contracts[0]?.landlordOrgnr?.toString() || "")

  content = content.replace("[LEIETAKER_NAME]", tenantDetails.name || "")
  content = content.replace("[LEIETAKER_ORGNR]", tenantDetails.orgnr?.toString() || "")

  content = content.replace("[EIENDOMMEN_ADRESSE]", tenantDetails.building?.address || "")
  content = content.replace("[EIENDOMMEN_GNR]", tenantDetails.building?.gnr?.toString() || "")
  content = content.replace("[EIENDOMMEN_BNR]", tenantDetails.building?.bnr?.toString() || "")
  content = content.replace("[EIENDOMMEN_FNR]", tenantDetails.building?.fnr?.toString() || "")
  content = content.replace("[EIENDOMMEN_SNR]", tenantDetails.building?.snr?.toString() || "")
  content = content.replace("[EIENDOMMEN_KOMMUNE]", tenantDetails.building?.kommune || "") // Replace with actual municipality
  content = content.replace("[EIENDOMMEN_KOMMUNENUMMER]", tenantDetails.building?.kommunenummer?.toString() || "") // Replace with actual municipality number

  content = content.replace("[LEIEOBJEKTET_KVM]", tenantDetails.building?.kvm?.toString() || "") // Replace with actual size of the lease object

  content = content.replace("[KONTRAKT_TYPE]", tenantDetails.contracts[0]?.contractType || "")
  content = content.replace("[CONTACT_NAME]", tenantDetails.contracts[0]?.contactName || "")
  content = content.replace("[CONTACT_EMAIL]", tenantDetails.contracts[0]?.contactEmail || "")
  content = content.replace("[CONTACT_PHONE]", tenantDetails.contracts[0]?.contactPhone || "")
  content = content.replace("[START_DATE]", tenantDetails.contracts[0]?.startDate ? new Date(tenantDetails.contracts[0].startDate).toLocaleDateString() : "")
  content = content.replace("[END_DATE]", tenantDetails.contracts[0]?.endDate ? new Date(tenantDetails.contracts[0].endDate).toLocaleDateString() : "")
  content = content.replace("[NEGOTIATION_DATE]", tenantDetails.contracts[0]?.negotiationDate ? new Date(tenantDetails.contracts[0].negotiationDate).toLocaleDateString() : "")
  content = content.replace("[IS_RENEWABLE]", tenantDetails.contracts[0]?.isRenewable ? "Yes" : "No")
  content = content.replace("[RENEWABLE_PERIOD]", tenantDetails.contracts[0]?.renewablePeriod?.toString() || "")
  content = content.replace("[INDEXATION_TYPE]", tenantDetails.contracts[0]?.indexationType || "")
  content = content.replace("[INDEX_VALUE]", tenantDetails.contracts[0]?.indexValue?.toString() || "")
  content = content.replace("[INDEXATION_DATE]", tenantDetails.contracts[0]?.indexationDate ? new Date(tenantDetails.contracts[0].indexationDate).toLocaleDateString() : "")
  content = content.replace("[BASE_RENT]", tenantDetails.contracts[0]?.baseRent?.toString() || "")
  content = content.replace("[RENT_PERIOD]", tenantDetails.contracts[0]?.rentPeriod || "")
  content = content.replace("[VAT_TERMS]", tenantDetails.contracts[0]?.vatTerms || "")
  content = content.replace("[BUSINESS_CATEGORY]", tenantDetails.contracts[0]?.businessCategory || "")
  content = content.replace("[COLLATERAL]", tenantDetails.contracts[0]?.collateral || "")
  content = content.replace("[CREATED_AT]", tenantDetails.contracts[0]?.createdAt ? new Date(tenantDetails.contracts[0].createdAt).toLocaleDateString('no-NO') : "")
  content = content.replace("[UPDATED_AT]", tenantDetails.contracts[0]?.updatedAt ? new Date(tenantDetails.contracts[0].updatedAt).toLocaleDateString('no-NO') : "")

  // Replace the lease period description based on isContinuousRent
  if (tenantDetails.contracts[0]?.isContinuousRent) {
    content = content.replace("[LEIEPERIODE_BESKRIVELSE]", 
      `<p>5.1 Leieavtalen er løpende og gjelder inntil den sies opp av en av partene i henhold til husleielovens bestemmelser.</p>`
    )
  } else {
    const startDate = tenantDetails.contracts[0]?.startDate ? new Date(tenantDetails.contracts[0].startDate).toLocaleDateString('no-NO') : '[...]'
    const endDate = tenantDetails.contracts[0]?.endDate ? new Date(tenantDetails.contracts[0].endDate).toLocaleDateString('no-NO') : '[...]'
    
    content = content.replace("[LEIEPERIODE_BESKRIVELSE]", `
<p>5.1 Leieforholdet løper fra ${startDate} (Overtakelse) til ${endDate} (Leieperioden), hvoretter leieforholdet opphører uten oppsigelse. Leieforholdet kan ikke sies opp i Leieperioden.</p>
<p>5.2 Fristen for å sende flyttingsoppfordring etter Leieperiodens utløp er seks måneder.</p>
    `)
  }

  return content
}
