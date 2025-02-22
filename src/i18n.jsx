import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      createTemplate: 'Create Template',
      settings: 'Settings',
      questions: 'Questions',
      Notemplatesavailable: 'No templates available.',
      results: 'Results',
      aggregation: 'Aggregation',
      logout: 'Logout',
      login: 'Login',
      allTemplates: 'All Templates',
      view: 'View',
      createNewTemplate: 'Create a New Template',
      title: 'Title',
      description: 'Description',
      singleLineText: 'Single-Line Text',
      multiLineText: 'Multi-Line Text',
      positiveInteger: 'Positive Integer',
      checkbox: 'Checkbox',
      Forms: 'Forms',
      aggregatedValue: 'Aggregated Value',
      manageQuestions: 'Manage Questions',
      saveQuestions: 'Save Questions',
      like: 'Like',
      deleteTemplate: 'Delete Template',
      Delete: 'Delete',
    },
  },
  ru: {
    translation: {
      Notemplatesavailable: 'Шаблоны отсутствуют',
      welcome: 'Добро пожаловать',
      createTemplate: 'Создать шаблон',
      settings: 'Настройки',
      questions: 'Вопросы',
      results: 'Результаты',
      aggregation: 'Агрегация',
      logout: 'Выйти',
      login: 'Войти',
      allTemplates: 'Все шаблоны',
      view: 'Просмотр',
      createNewTemplate: 'Создать новый шаблон',
      title: 'Заголовок',
      description: 'Описание',
      singleLineText: 'Однострочный текст',
      multiLineText: 'Многострочный текст',
      positiveInteger: 'Положительное целое число',
      checkbox: 'Флажок',
      Forms: 'Формы',
      aggregatedValue: 'Агрегированное значение',
      manageQuestions: 'Управление вопросами',
      saveQuestions: 'Сохранить вопросы',
      like: 'Нравится',
      deleteTemplate: 'Удалить шаблон',
      Delete: 'Удалить',
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
