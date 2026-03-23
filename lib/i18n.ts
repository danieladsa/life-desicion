import type { ConnectionLabel, NodeCategory } from './flowchart-types';

export type Language = 'es' | 'en' | 'pt';

export const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

const categoryTranslations: Record<Language, Record<NodeCategory, string>> = {
  es: {
    finance: 'Finanzas',
    education: 'Educación',
    migration: 'Migración',
    work: 'Trabajo',
  },
  en: {
    finance: 'Finance',
    education: 'Education',
    migration: 'Migration',
    work: 'Work',
  },
  pt: {
    finance: 'Finanças',
    education: 'Educação',
    migration: 'Migração',
    work: 'Trabalho',
  },
};

const connectionTranslations: Record<Language, Record<ConnectionLabel, string>> = {
  es: {
    yes: 'Sí',
    no: 'No',
    maybe: 'Tal vez',
    none: 'Sin etiqueta',
  },
  en: {
    yes: 'Yes',
    no: 'No',
    maybe: 'Maybe',
    none: 'No label',
  },
  pt: {
    yes: 'Sim',
    no: 'Não',
    maybe: 'Talvez',
    none: 'Sem rótulo',
  },
};

const uiTranslations = {
  es: {
    addNode: 'Agregar nodo',
    changeTheme: 'Cambiar tema',
    export: 'Exportar',
    import: 'Importar',
    categories: 'Categorías',
    connections: 'Conexiones',
    createNote: 'Crear nueva nota',
    editNote: 'Editar nota',
    title: 'Título',
    titlePlaceholder: 'Título de la nota...',
    description: 'Descripción',
    descriptionPlaceholder: 'Descripción o pregunta...',
    category: 'Categoría',
    create: 'Crear nota',
    save: 'Guardar cambios',
    untitled: 'Sin título',
  },
  en: {
    addNode: 'Add node',
    changeTheme: 'Toggle theme',
    export: 'Export',
    import: 'Import',
    categories: 'Categories',
    connections: 'Connections',
    createNote: 'Create new note',
    editNote: 'Edit note',
    title: 'Title',
    titlePlaceholder: 'Note title...',
    description: 'Description',
    descriptionPlaceholder: 'Description or question...',
    category: 'Category',
    create: 'Create note',
    save: 'Save changes',
    untitled: 'Untitled',
  },
  pt: {
    addNode: 'Adicionar nó',
    changeTheme: 'Alternar tema',
    export: 'Exportar',
    import: 'Importar',
    categories: 'Categorias',
    connections: 'Conexões',
    createNote: 'Criar nova nota',
    editNote: 'Editar nota',
    title: 'Título',
    titlePlaceholder: 'Título da nota...',
    description: 'Descrição',
    descriptionPlaceholder: 'Descrição ou pergunta...',
    category: 'Categoria',
    create: 'Criar nota',
    save: 'Salvar alterações',
    untitled: 'Sem título',
  },
} as const;

export function getCategoryLabel(category: NodeCategory, language: Language): string {
  return categoryTranslations[language][category];
}

export function getConnectionLabel(label: ConnectionLabel, language: Language): string {
  return connectionTranslations[language][label];
}

export function getUiText(language: Language) {
  return uiTranslations[language];
}
