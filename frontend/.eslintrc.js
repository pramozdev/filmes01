module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  rules: {
    // Regras do React
    'react/react-in-jsx-scope': 'off', // Não é necessário importar React em cada arquivo com React 17+
    'react/prop-types': 'warn', // Avisa sobre props não documentadas
    'react/self-closing-comp': 'warn', // Avisa sobre componentes que podem ser auto-fechados
    'react-hooks/rules-of-hooks': 'error', // Verifica as regras dos Hooks
    'react-hooks/exhaustive-deps': 'warn', // Verifica as dependências dos efeitos
    
    // Melhores práticas
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Avisa sobre variáveis não utilizadas
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Permite apenas console.warn e console.error
    'prefer-const': 'warn', // Prefira const sobre let quando possível
    'no-var': 'error', // Use const ou let ao invés de var
    
    // Formatação (deixar para o Prettier)
    'prettier/prettier': 'warn',
  },
  settings: {
    react: {
      version: 'detect', // Detecta automaticamente a versão do React
    },
  },
};
