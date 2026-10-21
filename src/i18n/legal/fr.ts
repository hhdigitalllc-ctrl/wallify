import { FREE_LIMITS, LIFETIME_PRICE_USD, PRO_PRICE_USD } from "@/lib/billing";
import type { LegalSet } from "./types";

export const legalFr: LegalSet = {
  kicker: "Juridique",
  updatedLabel: "Dernière mise à jour",
  questions: "Questions",

  terms: {
    title: "Conditions d'utilisation",
    description: "Les conditions qui régissent votre utilisation de Wallify.",
    updated: "21 octobre 2026",
    lede: "En bref : Wallify vous aide à collecter et afficher des témoignages. Ne publiez que des témoignages authentiques, votre contenu reste le vôtre et vous pouvez résilier à tout moment.",
    sections: [
      {
        h: "À propos de ces conditions",
        p: [
          "Ces conditions régissent votre utilisation de Wallify (le « Service »), exploité par HH Digital LLC (« nous »). En créant un compte ou en utilisant le Service, vous les acceptez. Si vous ne les acceptez pas, n'utilisez pas le Service.",
        ],
      },
      {
        h: "Ce que fait Wallify",
        p: [
          "Wallify vous permet de créer un espace, de partager un lien public où vos clients laissent une note et un témoignage, de valider ceux que vous souhaitez et de les afficher sur votre site grâce à un widget intégrable ou à une page publique.",
        ],
      },
      {
        h: "Votre compte",
        p: [
          "Vous devez fournir des informations exactes et protéger votre mot de passe. Vous êtes responsable de toute activité sur votre compte. Vous devez avoir au moins 16 ans pour utiliser le Service. Prévenez-nous immédiatement si vous soupçonnez un accès non autorisé.",
        ],
      },
      {
        h: "Uniquement des témoignages authentiques",
        p: [
          "Vous ne pouvez publier que des témoignages provenant de vrais clients ou utilisateurs qui les ont rédigés eux-mêmes. N'écrivez pas, ne modifiez pas, n'achetez pas et ne fabriquez pas de témoignages, et ne changez pas le sens de ce que quelqu'un a écrit. Les lois sur la protection des consommateurs et la publicité de nombreux pays interdisent les faux avis ou les avis trompeurs, et il vous appartient de les respecter.",
          "Vous êtes responsable de disposer des droits nécessaires pour afficher les noms et les propos soumis via votre lien de collecte.",
        ],
      },
      {
        h: "Utilisation acceptable",
        p: [
          "N'utilisez pas le Service pour enfreindre la loi, harceler ou tromper des personnes, envoyer du spam, diffuser des logiciels malveillants ou publier des contenus illicites, haineux ou portant atteinte aux droits d'autrui. N'essayez pas d'extraire massivement des données, de surcharger, de sonder ou de rétro-concevoir le Service, ni de contourner ses limites.",
        ],
      },
      {
        h: "Votre contenu",
        p: [
          "Vous restez propriétaire de votre contenu et des témoignages que vous collectez. Vous nous accordez une licence limitée pour héberger, traiter et afficher ce contenu uniquement afin de faire fonctionner le Service pour vous, y compris l'affichage des témoignages validés sur votre mur et votre widget. Nous pouvons supprimer les contenus qui enfreignent ces conditions.",
        ],
      },
      {
        h: "Offres et facturation",
        p: [
          `L'offre Gratuite comprend ${FREE_LIMITS.spaces} espace et jusqu'à ${FREE_LIMITS.approvedTestimonials} témoignages validés, avec un badge « Propulsé par Wallify ».`,
          `Pro coûte ${PRO_PRICE_USD} $ par mois et se renouvelle automatiquement chaque mois jusqu'à ce que vous résiliiez. Vous pouvez résilier à tout moment depuis « Gérer la facturation » dans votre tableau de bord. La résiliation prend effet à la fin de la période déjà payée, et vous gardez l'accès jusque-là.`,
          `Lifetime est un paiement unique de ${LIFETIME_PRICE_USD} $ qui vous donne les fonctionnalités Pro tant que Wallify est proposé, mises à jour futures comprises. Ce n'est pas un abonnement et il ne se renouvelle pas. Si nous arrêtons définitivement le Service, nous vous préviendrons au moins 30 jours à l'avance et, pendant ce délai, vous pourrez nous demander un export de vos témoignages.`,
          "Les paiements sont traités par Stripe. Nous ne voyons ni ne conservons jamais vos données complètes de carte bancaire. Les prix sont affichés avant le paiement et peuvent inclure les taxes applicables. Si nous modifions le prix d'un abonnement, nous vous en informerons à l'avance et le nouveau prix s'appliquera dès votre prochain renouvellement. Le prix des achats Lifetime déjà effectués ne change pas.",
          "Les remboursements sont décrits dans notre Politique de remboursement.",
        ],
      },
      {
        h: "Limites de l'offre gratuite",
        p: [
          "Si une offre payante prend fin, votre compte revient aux limites de l'offre gratuite. Vos données sont conservées, mais votre mur public n'affiche que vos témoignages validés les plus récents dans la limite gratuite, et vous ne pouvez pas en valider d'autres tant que vous n'êtes pas sous cette limite.",
        ],
      },
      {
        h: "Disponibilité et évolutions",
        p: [
          "Nous nous efforçons de maintenir le Service disponible et sécurisé, mais nous ne garantissons pas qu'il sera ininterrompu ou sans erreur. Nous pouvons améliorer, modifier ou retirer des fonctionnalités. Nous tâcherons de vous prévenir raisonnablement à l'avance des changements qui vous touchent de manière significative.",
        ],
      },
      {
        h: "Résiliation",
        p: [
          "Vous pouvez cesser d'utiliser le Service à tout moment et nous demander de supprimer votre compte. Nous pouvons suspendre ou clôturer les comptes qui enfreignent ces conditions ou mettent en danger le Service ou d'autres utilisateurs. Les clauses qui, par nature, doivent survivre à la résiliation, comme la propriété, la responsabilité et le droit applicable, resteront en vigueur.",
        ],
      },
      {
        h: "Garanties et responsabilité",
        p: [
          "Le Service est fourni « tel quel », sans garantie d'aucune sorte. Dans toute la mesure permise par la loi, nous ne sommes pas responsables des pertes indirectes, accessoires ou consécutives, ni des pertes de bénéfices ou de données, et notre responsabilité totale pour toute réclamation relative au Service est limitée au montant que vous nous avez payé au cours des douze mois précédant la réclamation. Rien dans ces conditions ne limite les droits que votre droit local de la consommation vous accorde et auxquels il est impossible de renoncer.",
        ],
      },
      {
        h: "Droit applicable",
        p: [
          "Ces conditions sont régies par les lois de l'État du Wyoming, États-Unis, sans égard à ses règles de conflit de lois, sauf lorsque votre droit local de la consommation vous accorde des droits auxquels il est impossible de renoncer. Sous réserve de ces droits, les tribunaux étatiques et fédéraux siégeant dans le Wyoming sont seuls compétents pour les litiges découlant de ces conditions.",
        ],
      },
      {
        h: "Modifications de ces conditions",
        p: [
          "Nous pouvons mettre à jour ces conditions de temps à autre. Les modifications importantes prennent effet dès leur publication sur cette page, avec une nouvelle date de « dernière mise à jour ». Si vous continuez à utiliser le Service ensuite, vous acceptez les conditions révisées.",
        ],
      },
    ],
  },

  privacy: {
    title: "Politique de confidentialité",
    description: "Comment Wallify collecte, utilise et protège les données personnelles.",
    updated: "21 octobre 2026",
    lede: "En bref : nous ne collectons que ce qui est nécessaire pour faire fonctionner Wallify, nous n'utilisons ni publicité ni outils de suivi, nous ne vendons jamais vos données et votre base de données est hébergée dans l'UE.",
    sections: [
      {
        h: "Qui sommes-nous",
        p: [
          "Wallify est exploité par HH Digital LLC (« nous »). Pour toute question ou demande concernant les données personnelles, écrivez à contact@hhdigitalllc.us.",
        ],
      },
      {
        h: "Deux types de personnes",
        p: [
          "Les titulaires de compte sont les personnes qui s'inscrivent sur Wallify. Pour les données de leur compte, nous sommes le responsable du traitement.",
          "Les auteurs de témoignages sont les personnes qui laissent un témoignage via un lien de collecte Wallify. Pour ces données, le titulaire du compte propriétaire de l'espace décide des finalités et des moyens (responsable du traitement) et nous les traitons pour son compte (sous-traitant).",
        ],
      },
      {
        h: "Ce que nous collectons",
        p: [
          "Titulaires de compte : votre adresse e-mail, un mot de passe haché de manière sécurisée, les noms, titres et adresses web de vos espaces, et l'état de votre offre.",
          "Auteurs de témoignages : la note, le texte, le nom et, facultativement, le poste ou l'entreprise que vous saisissez dans le formulaire. Rien d'autre n'est requis.",
          "Paiements : gérés par Stripe. Nous recevons et conservons uniquement une référence client Stripe, l'état et la date de renouvellement de votre abonnement, et l'indication d'un achat Lifetime. Nous ne voyons jamais votre numéro de carte complet.",
          "Données techniques : comme tout service web, notre hébergeur traite votre adresse IP et des informations sur les requêtes dans des journaux serveur de courte durée afin de fournir et sécuriser le Service.",
        ],
      },
      {
        h: "Comment nous les utilisons",
        p: [
          "Nous utilisons les données pour fournir le Service : vous connecter, afficher votre tableau de bord, afficher les témoignages validés sur le mur et le widget, envoyer les e-mails de compte comme la confirmation d'adresse, et encaisser les paiements. Nous les utilisons aussi pour prévenir les abus et assurer la sécurité du Service.",
          "Nos bases légales sont l'exécution de notre contrat avec vous, notre intérêt légitime à exploiter un service sécurisé et, pour les auteurs de témoignages, votre consentement lorsque vous envoyez le formulaire.",
        ],
      },
      {
        h: "Les témoignages sont publics une fois validés",
        p: [
          "Si vous laissez un témoignage, votre nom, votre poste éventuel et vos propos peuvent être affichés publiquement sur le site du propriétaire de l'espace et sur sa page de mur Wallify, mais uniquement après validation par le propriétaire. Pour faire retirer un témoignage, adressez-vous au propriétaire de l'espace ou écrivez-nous et nous vous aiderons.",
        ],
      },
      {
        h: "Cookies et suivi",
        p: [
          "Nous n'utilisons que les cookies essentiels nécessaires pour vous garder connecté. Nous n'utilisons ni cookies publicitaires ni outils de mesure d'audience, nous ne vous suivons pas sur d'autres sites, et le widget intégrable ne suit pas les visiteurs du site sur lequel il apparaît.",
        ],
      },
      {
        h: "Avec qui nous partageons les données",
        p: [
          "Nous faisons appel à un petit nombre de prestataires (sous-traitants) pour faire fonctionner Wallify : Supabase (base de données et connexion, hébergées dans l'UE, en Irlande), Vercel (hébergement), Stripe (paiements) et Resend (e-mails transactionnels). Ils traitent les données uniquement sur nos instructions et selon leurs propres engagements de sécurité.",
          "Certains de ces prestataires peuvent traiter des données en dehors de l'Espace économique européen. Dans ce cas, ils s'appuient sur des garanties reconnues telles que les clauses contractuelles types. Nous ne vendons pas vos données personnelles.",
        ],
      },
      {
        h: "Durée de conservation",
        p: [
          "Nous conservons les données de compte tant que votre compte est actif. Si vous nous demandez de supprimer votre compte, nous supprimons votre compte, vos espaces et vos témoignages sous 30 jours, à l'exception des enregistrements limités que la loi nous oblige à conserver (comme les justificatifs de paiement détenus par Stripe). Les sauvegardes sont écrasées de manière périodique.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Selon votre lieu de résidence, vous pouvez avoir le droit d'accéder à vos données personnelles, de les rectifier, de les supprimer ou de les exporter, de vous opposer à certains traitements ou de les limiter, et de retirer votre consentement. Pour exercer ces droits, écrivez à contact@hhdigitalllc.us. Nous répondrons dans les délais prévus par la loi.",
          "Si vous êtes dans l'UE ou au Royaume-Uni, vous avez également le droit d'introduire une réclamation auprès de votre autorité de protection des données.",
        ],
      },
      {
        h: "Sécurité",
        p: [
          "Nous utilisons des contrôles d'accès, le chiffrement en transit, des mots de passe hachés et la sécurité au niveau des lignes afin que chaque compte n'accède qu'à ses propres données. Aucun service en ligne n'est parfaitement sûr, mais nous prenons des mesures raisonnables pour protéger vos informations et vous informerons d'une violation lorsque la loi l'exige.",
        ],
      },
      {
        h: "Enfants",
        p: [
          "Wallify ne s'adresse pas aux enfants de moins de 16 ans et nous ne collectons pas sciemment leurs données personnelles.",
        ],
      },
      {
        h: "Modifications de cette politique",
        p: ["Si nos pratiques changent, nous mettrons à jour cette page et réviserons la date ci-dessus."],
      },
    ],
  },

  refunds: {
    title: "Politique de remboursement",
    description: "Notre politique de remboursement sous 14 jours pour Wallify Pro et Lifetime.",
    updated: "21 octobre 2026",
    lede: "En bref : si Wallify ne vous convient pas, demandez un remboursement dans les 14 jours suivant votre paiement et nous vous rembourserons. Sans questions embarrassantes.",
    sections: [
      {
        h: "Remboursement sous 14 jours",
        p: [
          `Vous pouvez demander un remboursement intégral dans les 14 jours suivant votre premier paiement pour Pro (${PRO_PRICE_USD} $/mois) ou Lifetime (${LIFETIME_PRICE_USD} $ en une fois), quel qu'en soit le motif.`,
        ],
      },
      {
        h: "Renouvellements",
        p: [
          "Pro se renouvelle chaque mois jusqu'à ce que vous résiliiez. Résiliez avant votre date de renouvellement pour éviter le prélèvement suivant. Si vous avez été débité d'un renouvellement alors que vous ne souhaitiez pas continuer, contactez-nous dans les 7 jours suivant ce prélèvement et nous le rembourserons.",
        ],
      },
      {
        h: "Après 14 jours",
        p: [
          "Passé le délai de remboursement, les paiements ne sont pas remboursables, sauf si la loi en dispose autrement. Vous pouvez toujours résilier Pro à tout moment et conserver l'accès jusqu'à la fin de la période payée.",
        ],
      },
      {
        h: "Comment faire la demande",
        p: [
          "Écrivez à contact@hhdigitalllc.us depuis l'adresse de votre compte en précisant l'offre achetée. Nous confirmerons et traiterons le remboursement via Stripe, qui parvient généralement sur votre moyen de paiement d'origine sous 5 à 10 jours ouvrés.",
        ],
      },
      {
        h: "Ce qui arrive à votre compte",
        p: [
          "Après un remboursement, un abonnement Pro est annulé et un achat Lifetime est retiré, et votre compte revient à l'offre gratuite et à ses limites. Vos espaces et vos témoignages sont conservés.",
        ],
      },
      {
        h: "Vos droits légaux",
        p: [
          "Cette politique s'ajoute aux droits que vous confère le droit de la consommation de votre pays, que nous ne limitons pas. Nous pouvons refuser un remboursement lorsque nous estimons raisonnablement que la politique est détournée, par exemple en cas de cycles répétés d'achat et de remboursement.",
        ],
      },
    ],
  },
};
