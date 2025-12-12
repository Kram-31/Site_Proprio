import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    tattoos: collection({
      label: 'Portfolio / Tatouages',
      slugField: 'title',
      path: 'src/content/tattoos/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        image: fields.image({
          label: 'Image principale',
          directory: 'src/assets/tattoos',
          publicPath: '@assets/tattoos',
        }),
        gallery: fields.array(
          fields.image({
            label: 'Image',
            directory: 'src/assets/tattoos/gallery',
            publicPath: '@assets/tattoos/gallery',
          }),
          {
            label: 'Galerie (Zooms / Angles)',
            itemLabel: (props) => 'Image',
          }
        ),
        tags: fields.multiselect({
          label: 'Tags / Style',
          options: [
            { label: 'Blackwork', value: 'blackwork' },
            { label: 'Neotrad', value: 'neotrad' },
            { label: 'Réalisme', value: 'realisme' },
            { label: 'Fineline', value: 'fineline' },
            { label: 'Ornemental', value: 'ornemental' },
            { label: 'Autre', value: 'autre' },
          ],
          defaultValue: ['blackwork'],
        }),
        status: fields.select({
          label: 'État',
          options: [
            { label: 'Réalisé', value: 'done' },
            { label: 'Flash Disponible', value: 'flash' },
          ],
          defaultValue: 'done',
        }),
        publishedDate: fields.date({
            label: 'Date de réalisation',
            defaultValue: { kind: 'today' }
        }),
        content: fields.markdoc({
          label: 'Description / Contenu',
        }),
      },
    }),
    guestSpots: collection({
      label: 'Guest Spots',
      slugField: 'city',
      path: 'src/content/guests/*',
      schema: {
        city: fields.slug({ name: { label: 'Ville / Studio' } }),
        dates: fields.text({ label: 'Dates' }),
        link: fields.url({ label: 'Lien de réservation' }),
      },
    }),
  },
  singletons: {
    globalInfo: singleton({
      label: 'Infos Globales',
      path: 'src/content/global/info',
      schema: {
        bookingStatus: fields.select({
          label: 'Statut du Booking',
          options: [
            { label: 'Ouvert', value: 'open' },
            { label: 'Fermé', value: 'closed' },
          ],
          defaultValue: 'open',
        }),
        announcement: fields.text({
          label: "Texte d'annonce",
          description: 'Ex: "En guest à Paris du 10 au 15 octobre"',
        }),
        instagram: fields.url({ label: 'Lien Instagram' }),
      },
    }),
  },
});
