# @repo/test-config

Configuración compartida de Jest para todos los paquetes del monorepo.

## Uso

En el `jest.config.js` de tu paquete:

```javascript
const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'tu-paquete',
  // Añade configuración específica aquí
};
```

## Características

- Preset de `ts-jest` para soporte de TypeScript
- Paths de importación con alias `@/`
- Cobertura de código configurada
- Timeout de 10 segundos por test
- Soporte para archivos `.spec.ts` y `.test.ts`
