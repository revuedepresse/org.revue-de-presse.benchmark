const DISPLAY_NAMES: Record<string, string> = {
  'lemonde.fr':          'Le Monde',
  'mediapart.fr':        'Mediapart',
  'franceculture.fr':    'France Culture',
  'liberation.fr':       'Libération',
  'lefigaro.fr':         'Le Figaro',
  'lequipe.fr':          'L’Équipe',
  'arretsurimages.net':  'Arrêt sur images',
  'francetvinfo.fr':     'France Info',
  'lesechos.fr':         'Les Échos',
  'la-croix.com':        'La Croix',
};

export function handleToDisplayName(handle: string): string {
  return DISPLAY_NAMES[handle] ?? handle.replace(/\.[a-z]+$/i, '');
}
