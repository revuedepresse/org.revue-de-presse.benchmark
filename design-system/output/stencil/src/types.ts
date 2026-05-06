// Icon names match the symbols emitted by scripts/build-sprite.mjs from
// the legacy `org.revue-de-presse/assets/icons/` set.
export type IconName =
  | 'funding'
  | 'github'
  | 'heart'
  | 'introducing'
  | 'like-clicked'
  | 'like-intent'
  | 'like-metric'
  | 'next-day'
  | 'next-item'
  | 'pick-day'
  | 'pick-item'
  | 'pick-list'
  | 'previous-day'
  | 'previous-item'
  | 'reply'
  | 'retweet'
  | 'share'
  | 'sharing'
  | 'warning';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'scrollTop'
  | 'calendarNav'
  | 'form'
  | 'avatar'
  | 'quit';

export type ErrorMessage = {
  key: string;
  vars?: Record<string, string | number>;
};

export type Direction = 'up' | 'down' | 'left' | 'right';
