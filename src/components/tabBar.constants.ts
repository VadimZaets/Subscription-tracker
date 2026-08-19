/** Геометрія плаваючого таб-бара. SnapsyTabBar малює бар, екрани лишають під нього
 *  місце через TAB_BAR_CLEARANCE — обидва рахуються звідси, щоб не розповзалися. */
export const TAB_BAR_HEIGHT = 62;
export const TAB_BAR_BOTTOM = 18;

/** Що більший інсет — то вужчий бар. */
export const TAB_BAR_INSET_H = 56;

const CONTENT_GAP = 12;

/** Скільки місця лишити знизу контенту екрана, щоб він не ховався під баром. */
export const TAB_BAR_CLEARANCE = TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + CONTENT_GAP;
