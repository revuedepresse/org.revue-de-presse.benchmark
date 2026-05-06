export type IconName =
  | 'logo'
  | 'bluesky'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'grid-view'
  | 'list-view'
  | 'eye'
  | 'share'
  | 'heart'
  | 'bell'
  | 'x'
  | 'user'
  | 'reply'
  | 'repost'
  | 'like';

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
