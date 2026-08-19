// Не рендериться: tabPress-listener у _layout.tsx перехоплює тап і відкриває /add модалкою.
// Файл потрібен лише щоб expo-router мав валідний route для цього таба.
const AddActionPlaceholder = () => null;

export default AddActionPlaceholder;
