// L'assistant e-CIN répond UNIQUEMENT à partir des procédures enregistrées ici.
// Il ne doit jamais inventer une règle administrative. Si une question ne
// correspond à aucune entrée connue, l'assistant renvoie le message de repli
// standard défini dans REPONSE_INCONNUE, dans la langue active.

export type Langue = "fr" | "ar" | "so";

export interface EntreeFAQ {
  motsClefs: string[];
  question: string;
  reponse: string;
}

export const REPONSE_INCONNUE: Record<Langue, string> = {
  fr: "Cette information doit être confirmée auprès du service compétent.",
  ar: "يجب التحقق من هذه المعلومة لدى الجهة المختصة.",
  so: "Macluumaadkan waa in laga xaqiijiyaa xafiiska khuseeya.",
};

export const MESSAGE_ACCUEIL: Record<Langue, string> = {
  fr: "Bonjour, je suis l'assistant e-CIN. Je réponds à partir des procédures officiellement enregistrées. Comment puis-je vous aider ?",
  ar: "مرحبًا، أنا مساعد e-CIN. أجيب فقط استنادًا إلى الإجراءات المسجلة رسميًا. كيف يمكنني مساعدتك؟",
  so: "Salaan, waxaan ahay kaaliyaha e-CIN. Waxaan uun ka jawaabaa hababka rasmiga ah ee la diiwaan geliyey. Sidee baan kuu caawin karaa?",
};

export const NOMS_LANGUES: Record<Langue, string> = {
  fr: "Français",
  ar: "العربية",
  so: "Soomaali",
};

export const SUGGESTIONS: Record<Langue, string[]> = {
  fr: [
    "Comment faire une première demande ?",
    "Comment renouveler ma CIN ?",
    "J'ai perdu ma CIN, que dois-je faire ?",
    "Quels documents dois-je fournir ?",
  ],
  ar: [
    "كيف أقدم طلبًا لأول مرة؟",
    "كيف أجدد بطاقتي الوطنية؟",
    "فقدت بطاقتي، ماذا أفعل؟",
    "ما هي الوثائق التي يجب علي تقديمها؟",
  ],
  so: [
    "Sidee baan u sameeyaa codsi markii ugu horreysa?",
    "Sidee baan u cusboonaysiiyaa kaadhkayga aqoonsiga?",
    "Waan lumiyay kaadhkayga, maxaan sameeyaa?",
    "Waa maxay dukumentiyada aan soo gudbin karo?",
  ],
};

export const FAQ_ECIN: Record<Langue, EntreeFAQ[]> = {
  fr: [
    {
      motsClefs: ["premiere", "première", "premier", "jamais eu"],
      question: "Comment faire une première demande ?",
      reponse:
        "Choisissez « Première demande » depuis l'accueil. Renseignez votre identité, consultez la liste des pièces requises pour votre cas, téléversez vos documents et votre photo d'identité, puis vérifiez et transmettez votre dossier.",
    },
    {
      motsClefs: ["document", "pieces", "fournir", "papiers"],
      question: "Quels documents dois-je fournir ?",
      reponse:
        "Les pièces demandées dépendent de votre situation (première demande, renouvellement ou remplacement après perte). Le parcours guidé affiche automatiquement la liste exacte des pièces à téléverser pour votre cas.",
    },
    {
      motsClefs: ["renouveler", "renouvellement"],
      question: "Comment renouveler ma CIN ?",
      reponse:
        "Pour un renouvellement, préparez votre ancienne Carte d'Identité Nationale, une photo d'identité numérique récente, ainsi que les noms exacts des grand-mères paternelle et maternelle. Conservez aussi vos 3 photos physiques : elles pourront être demandées à votre rendez-vous.",
    },
    {
      motsClefs: ["perdu", "perte", "vole", "vol"],
      question: "J'ai perdu ma CIN, que dois-je faire ?",
      reponse:
        "Vous devez d'abord vous présenter personnellement auprès du service de police compétent pour effectuer votre déclaration de perte. Ce n'est qu'une fois ce document officiel obtenu que vous pourrez revenir sur e-CIN pour poursuivre votre demande de remplacement.",
    },
    {
      motsClefs: ["incomplet", "manque", "manquant"],
      question: "Pourquoi mon dossier est incomplet ?",
      reponse:
        "Un dossier est signalé incomplet lorsqu'une pièce obligatoire n'a pas été téléversée ou qu'un document n'a pas pu être lu correctement. Consultez la page de suivi de votre dossier : les pièces manquantes ou à corriger y sont indiquées.",
    },
    {
      motsClefs: ["rendez-vous", "rdv", "apporter"],
      question: "Que dois-je apporter à mon rendez-vous ?",
      reponse:
        "Apportez une pièce d'identité valide, la convocation ou le QR code de votre dossier, ainsi que vos 3 photos d'identité physiques. Sur place, l'administration réalise la photo biométrique officielle, prend vos empreintes digitales et effectue la capture de l'iris — e-CIN ne demande jamais ces éléments à distance.",
    },
    {
      motsClefs: ["biometrie", "biométrie", "empreinte", "iris", "oeil", "œil"],
      question: "Comment se déroule la biométrie ?",
      reponse:
        "La biométrie (photo officielle, empreintes digitales, capture de l'iris) est réalisée exclusivement en personne, au centre, avec les équipements officiels de l'administration. e-CIN ne vous demandera jamais de photographier votre œil, de transmettre une empreinte ou d'effectuer une reconnaissance d'iris depuis votre téléphone.",
    },
    {
      motsClefs: ["age", "âge", "18 ans", "mineur"],
      question: "Y a-t-il une condition d'âge ?",
      reponse:
        "Oui, cette plateforme est destinée aux personnes âgées de 18 ans ou plus. L'âge est vérifié automatiquement à partir de votre date de naissance dès la première étape de votre demande.",
    },
    {
      motsClefs: ["delai", "délai", "combien de temps", "attendre"],
      question: "Quel est le délai de traitement ?",
      reponse: REPONSE_INCONNUE.fr,
    },
  ],
  ar: [
    {
      motsClefs: ["أول", "لأول مرة", "طلب جديد"],
      question: "كيف أقدم طلبًا لأول مرة؟",
      reponse:
        "اختر «طلب أول مرة» من الصفحة الرئيسية. أدخل بياناتك الشخصية، اطّلع على قائمة الوثائق المطلوبة لحالتك، ثم قم برفع مستنداتك وصورتك الشخصية، وتحقّق من ملفك قبل إرساله.",
    },
    {
      motsClefs: ["وثائق", "وثيقة", "مستندات", "أوراق"],
      question: "ما هي الوثائق التي يجب علي تقديمها؟",
      reponse:
        "تعتمد الوثائق المطلوبة على حالتك (طلب أول مرة، تجديد، أو استبدال بعد الفقدان). يعرض المسار الموجَّه تلقائيًا القائمة الدقيقة للوثائق الخاصة بحالتك.",
    },
    {
      motsClefs: ["تجديد", "أجدد"],
      question: "كيف أجدد بطاقتي الوطنية؟",
      reponse:
        "من أجل التجديد، جهّز بطاقتك الوطنية القديمة، وصورة شخصية رقمية حديثة، بالإضافة إلى الاسمين الدقيقين لجدتيك من جهة الأب والأم. احتفظ أيضًا بصورك الثلاث الورقية، فقد تُطلب منك يوم الموعد.",
    },
    {
      motsClefs: ["فقدت", "ضاعت", "سرقة", "سُرقت"],
      question: "فقدت بطاقتي، ماذا أفعل؟",
      reponse:
        "يجب عليك أولًا التوجه شخصيًا إلى مركز الشرطة المختص لتقديم بلاغ عن الفقدان. بعد الحصول على الوثيقة الرسمية، يمكنك العودة إلى e-CIN لمتابعة طلب الاستبدال.",
    },
    {
      motsClefs: ["ناقص", "غير مكتمل", "نقص"],
      question: "لماذا ملفي غير مكتمل؟",
      reponse:
        "يُعتبر الملف غير مكتمل عندما لا يتم رفع وثيقة إلزامية أو عندما يتعذر قراءة مستند بشكل صحيح. راجع صفحة متابعة الملف للاطلاع على الوثائق الناقصة أو الواجب تصحيحها.",
    },
    {
      motsClefs: ["موعد", "أحضر"],
      question: "ماذا يجب أن أحضر إلى موعدي؟",
      reponse:
        "أحضر وثيقة هوية سارية، ودعوة الموعد أو رمز QR الخاص بملفك، بالإضافة إلى صورك الشخصية الورقية الثلاث. في المركز، تقوم الإدارة بالتقاط الصورة البيومترية الرسمية وبصمات الأصابع وقزحية العين — لا يطلب e-CIN هذه العناصر عن بُعد أبدًا.",
    },
    {
      motsClefs: ["بيومتري", "بصمة", "قزحية", "عين"],
      question: "كيف تتم العملية البيومترية؟",
      reponse:
        "تتم العملية البيومترية (الصورة الرسمية، بصمات الأصابع، قزحية العين) حصريًا شخصيًا في المركز باستخدام المعدات الرسمية للإدارة. لن يطلب منك e-CIN أبدًا تصوير عينك أو إرسال بصمة أو إجراء تعرف على القزحية من هاتفك.",
    },
    {
      motsClefs: ["سن", "عمر", "18 سنة", "قاصر"],
      question: "هل هناك شرط للسن؟",
      reponse:
        "نعم، هذه المنصة مخصصة للأشخاص البالغين 18 سنة فما فوق. يتم التحقق من السن تلقائيًا بناءً على تاريخ ميلادك منذ الخطوة الأولى من طلبك.",
    },
    {
      motsClefs: ["مدة", "وقت المعالجة"],
      question: "ما هي مدة المعالجة؟",
      reponse: REPONSE_INCONNUE.ar,
    },
  ],
  so: [
    {
      motsClefs: ["markii ugu horreysa", "codsi cusub"],
      question: "Sidee baan u sameeyaa codsi markii ugu horreysa?",
      reponse:
        "Ka dooro «Codsiga koowaad» bogga hore. Geli macluumaadkaaga shakhsiga, eeg liiska dukumentiyada loogu baahan yahay xaaladdaada, kadibna soo geli dukumentiyadaada iyo sawirkaaga, ka hor inta aanad codsigaaga dirin.",
    },
    {
      motsClefs: ["dukumenti", "waraaqo", "warqado"],
      question: "Waa maxay dukumentiyada aan soo gudbin karo?",
      reponse:
        "Dukumentiyada la doonayo waxay ku xiran yihiin xaaladdaada (codsi koowaad, cusboonaysiin, ama beddelid lumis ka dib). Habka lagu hagayo wuxuu si toos ah u muujiyaa liiska saxda ah ee dukumentiyada xaaladdaada.",
    },
    {
      motsClefs: ["cusboonaysii", "dib u cusboonaysiin"],
      question: "Sidee baan u cusboonaysiiyaa kaadhkayga aqoonsiga?",
      reponse:
        "Cusboonaysiinta, diyaari kaadhkaagii hore, sawir shakhsi oo dhawaan la qaaday, iyo magacyada saxda ah ee ayeeyooyinkaaga (aabbe iyo hooyo). Sii hay 3-da sawir ee jireed, waa laga yaabaa in laguu weydiiyo ballantaada.",
    },
    {
      motsClefs: ["lumiyay", "waa lumay", "xaday"],
      question: "Waan lumiyay kaadhkayga, maxaan sameeyaa?",
      reponse:
        "Marka hore waa inaad shakhsi ahaan tagtaa xafiiska booliska ee khuseeya si aad u sameyso dacwad lumis. Marka aad heshid dukumentiga rasmiga ah, waxaad ku noqon kartaa e-CIN si aad u sii wadato codsigaaga beddelka.",
    },
    {
      motsClefs: ["dhammaystirna", "ka maqan"],
      question: "Muxuu dossier-kaygu u dhammaystirna yahay?",
      reponse:
        "Dossier-ku wuxuu noqdaa mid aan dhammaystirnayn marka dukumenti waajib ah aan la soo gudbin ama aan si sax ah loo akhrin karin. Fiiri boggaaga la socodka dossier-ka si aad u aragto waxa ka maqan ama loo baahan yahay in la saxo.",
    },
    {
      motsClefs: ["ballan", "keen"],
      question: "Maxaan la iman karaa ballantayda?",
      reponse:
        "La imow aqoonsi sax ah, casuumadda ama koodka QR ee dossier-kaaga, iyo 3-da sawir ee jireed. Meesha, dawladdu waxay qaadaysaa sawirka bayoometriga rasmiga ah, faraha, iyo qiirada isha — e-CIN weligeed kama codsan waxyaabahan si fog ah.",
    },
    {
      motsClefs: ["bayoometri", "far", "qiiro", "isha"],
      question: "Sideed ku dhacdaa habka bayoometriga?",
      reponse:
        "Habka bayoometriga (sawirka rasmiga ah, faraha, qiirada isha) waxaa lagu sameeyaa keliya shakhsi ahaan xarunta, iyadoo la isticmaalayo qalabka rasmiga ah ee dawladda. e-CIN weligeed kuma weydiin doonto inaad sawirto ishaada, aad soo dirto far, ama aad taleefankaaga ka sameyso qiiro isha.",
    },
    {
      motsClefs: ["da'da", "18 sano", "qaanjo"],
      question: "Ma jiraa shuruudo da' ah?",
      reponse:
        "Haa, barnaamijkani wuxuu u gaar yahay dadka 18 sano jira ama ka weyn. Da'da waxaa si otomaatig ah loo xaqiijiyaa taariikhda dhalashadaada tan iyo tallaabada koowaad ee codsigaaga.",
    },
    {
      motsClefs: ["muddo", "waqtiga"],
      question: "Waa immisa muddada habaynta?",
      reponse: REPONSE_INCONNUE.so,
    },
  ],
};

export function repondreAssistant(question: string, langue: Langue): string {
  const q = question.toLowerCase();
  const correspondance = FAQ_ECIN[langue].find((entree) =>
    entree.motsClefs.some((mot) => q.includes(mot.toLowerCase()))
  );
  return correspondance ? correspondance.reponse : REPONSE_INCONNUE[langue];
}
