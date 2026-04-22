# Project Instructions

## General Guidelines for Antigravity
- Follow **Atomic Design** principles for UI components.
- Use **Angular** best practices.
- Ensure styling aligns with the existing theme (TailwindCSS/Vanilla CSS as applicable).
- Keep components focused and reusable.
- Components must be created using separate `.ts`, `.html`, and `.css` files. Only very small components should be created within a single `.ts` file.
- Prefer **Angular Reactive Forms** (`ReactiveFormsModule`, `FormGroup`, `FormControl`) over Template-driven forms (`FormsModule`, `ngModel`).
## API JSON Schemas

### Staging
- **Auth**: [https://auth-stg.brandbot.ch/swagger/v1/swagger.json](https://auth-stg.brandbot.ch/swagger/v1/swagger.json)
- **API**: [https://api-stg.brandbot.ch/swagger/v1/swagger.json](https://api-stg.brandbot.ch/swagger/v1/swagger.json)

### Production
- **Auth**: [https://auth.brandbot.ch/swagger/v1/swagger.json](https://auth.brandbot.ch/swagger/v1/swagger.json)
- **API**: [https://api.brandbot.ch/swagger/v1/swagger.json](https://api.brandbot.ch/swagger/v1/swagger.json)

## Development Environment
> [!IMPORTANT]
> All development should be made using the **Staging** environment.

## Environment Variables
- Always read `apiUrl` and `authUrl` from the `environment` configuration (e.g., `import { environment } from '@env/environment';`). Do not hardcode API or Auth URLs in services.
