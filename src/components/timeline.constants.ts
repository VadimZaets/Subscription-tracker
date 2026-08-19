/** Геометрія хронології. Timeline малює хребет, TimelineRow — крапку й риску до
 *  картки; обидва рахують позиції з цих значень, щоб не розповзалися. */
export const TIMELINE_PADDING_LEFT = 26;
export const SPINE_LEFT = 5;
export const SPINE_WIDTH = 1.5;
export const DOT_SIZE = 12;

const SPINE_CENTER = SPINE_LEFT + SPINE_WIDTH / 2;

/** Зсув крапки відносно рядка: центр крапки має збігтися з центром хребта. */
export const DOT_OFFSET_LEFT = SPINE_CENTER - TIMELINE_PADDING_LEFT - DOT_SIZE / 2;

/** Риска від крапки до лівого краю картки. */
export const CONNECTOR_LEFT = DOT_OFFSET_LEFT + DOT_SIZE;
export const CONNECTOR_WIDTH = -CONNECTOR_LEFT;
export const CONNECTOR_HEIGHT = SPINE_WIDTH;
