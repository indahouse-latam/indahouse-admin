# Endpoints: Property Risk y Property Investment States

Base URL: **`/api/v1`**

Headers requeridos (donde aplique): **`Authorization: Bearer <JWT_TOKEN>`**

---

## 1. Property Risk (Riesgo de propiedad)

### 1.1 Obtener riesgo de una propiedad

| Campo    | Valor |
|---------|--------|
| **Método** | `GET` |
| **URL** | `/api/v1/properties/:property_id/risk` |
| **Body** | No lleva body |
| **Params** | `property_id` (string, UUID de la propiedad) |

**Respuesta 200 (éxito):**
```json
{
  "code": "PRISK-200",
  "data": {
    "id": "d0e13206-8153-4318-8f85-4ab590bd27f5",
    "property_id": "24b3e153-14df-469f-819b-d0156552211f",
    "risk": "balanced",
    "strategy": "yield_optimizer",
    "primary_goal": "monthly_income",
    "horizon_start_years": 1,
    "horizon_end_years": 5,
    "created_at": "2023-11-20T14:30:00.000Z",
    "updated_at": "2023-11-20T14:30:00.000Z"
  }
}
```

**Respuesta 404:**
```json
{
  "error": {
    "code": "PRISK-404",
    "message": "Property risk not found"
  }
}
```

---

### 1.2 Crear riesgo para una propiedad

| Campo    | Valor |
|---------|--------|
| **Método** | `POST` |
| **URL** | `/api/v1/properties/:property_id/risk` |
| **Body** | Sí (JSON) |
| **Params** | `property_id` (string, UUID de la propiedad) |

**Body:**
```json
{
  "risk": "balanced"
}
```

Valores permitidos para `risk`:  
`moderate_short`, `balanced`, `venture`, `moderate`, `balanced_long`, `conservative`

**Respuesta 201 (éxito):**
```json
{
  "code": "PRISK-201",
  "data": {
    "id": "d0e13206-8153-4318-8f85-4ab590bd27f5",
    "property_id": "24b3e153-14df-469f-819b-d0156552211f",
    "risk": "balanced",
    "strategy": "yield_optimizer",
    "primary_goal": "monthly_income",
    "horizon_start_years": 1,
    "horizon_end_years": 5,
    "created_at": "2023-11-20T14:30:00.000Z",
    "updated_at": "2023-11-20T14:30:00.000Z"
  }
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "PRISK-400",
    "message": "Property already has a risk profile"
  }
}
```

---

### 1.3 Actualizar riesgo de una propiedad

| Campo    | Valor |
|---------|--------|
| **Método** | `PUT` |
| **URL** | `/api/v1/properties/:property_id/risk` |
| **Body** | Sí (JSON) |
| **Params** | `property_id` (string, UUID de la propiedad) |

**Body:**
```json
{
  "risk": "venture"
}
```

Valores permitidos: mismos que en 1.2.

**Respuesta 200 (éxito):**
```json
{
  "code": "PRISK-200",
  "data": {
    "id": "d0e13206-8153-4318-8f85-4ab590bd27f5",
    "property_id": "24b3e153-14df-469f-819b-d0156552211f",
    "risk": "venture",
    "strategy": "exclusive_build",
    "primary_goal": "gross_appreciation",
    "horizon_start_years": 2,
    "horizon_end_years": 4,
    "created_at": "2023-11-20T14:30:00.000Z",
    "updated_at": "2023-11-21T10:00:00.000Z"
  }
}
```

**Respuesta 404:**
```json
{
  "error": {
    "code": "PRISK-404",
    "message": "Property risk not found"
  }
}
```

---

### 1.4 Eliminar riesgo de una propiedad

| Campo    | Valor |
|---------|--------|
| **Método** | `DELETE` |
| **URL** | `/api/v1/properties/:property_id/risk` |
| **Body** | No lleva body |
| **Params** | `property_id` (string, UUID de la propiedad) |

**Respuesta 200 (éxito):**
```json
{
  "code": "PRISK-200",
  "message": "Property risk deleted"
}
```

**Respuesta 404:**
```json
{
  "error": {
    "code": "PRISK-404",
    "message": "Property risk not found"
  }
}
```

---

## 2. Property Investment States (Estados de inversión)

### 2.1 Listar estados de inversión de una propiedad

| Campo    | Valor |
|---------|--------|
| **Método** | `GET` |
| **URL** | `/api/v1/properties/:propertyId/investment-states` |
| **Body** | No lleva body |
| **Params** | `propertyId` (string, UUID de la propiedad) |

**Respuesta 200 (éxito):**
```json
{
  "code": "INV-200",
  "data": {
    "property_id": "24b3e153-14df-469f-819b-d0156552211f",
    "investment_states": [
      {
        "id": "uuid-del-estado",
        "title": "Pre-venta",
        "description": "Fase de pre-venta",
        "status": "ACTIVE",
        "order_position": 0,
        "milestone_date": "2024-06-01",
        "is_current_state": true,
        "status_color": "blue"
      }
    ]
  }
}
```

Valores posibles de `status`: `ACTIVE`, `DONE`, `FAILED`, `NOT_INITIATED`.  
`status_color`: `blue`, `green`, `red`, `gray`.

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to get investment states"
  }
}
```

---

### 2.2 Crear estados iniciales de inversión (Admin)

| Campo    | Valor |
|---------|--------|
| **Método** | `POST` |
| **URL** | `/api/v1/properties/:propertyId/investment-states` |
| **Body** | Sí (JSON) |
| **Params** | `propertyId` (string, UUID de la propiedad) |

**Body:**
```json
{
  "investment_states": [
    {
      "title": "Pre-venta",
      "description": "Fase de pre-venta",
      "milestone_date": "2024-06-01",
      "order_position": 0,
      "is_initial_state": true
    },
    {
      "title": "Construcción",
      "description": "En construcción",
      "milestone_date": "2025-01-15",
      "order_position": 1
    }
  ]
}
```

- `title`: string, 1–255 caracteres, obligatorio.  
- `description`: string, opcional.  
- `milestone_date`: string, formato `YYYY-MM-DD`, obligatorio.  
- `order_position`: number ≥ 0, obligatorio.  
- `is_initial_state`: boolean, opcional.  
- El array debe tener al menos un elemento.

**Respuesta 201 (éxito):**
```json
{
  "code": "INV-201",
  "message": "Investment states created successfully",
  "data": {
    "property_id": "24b3e153-14df-469f-819b-d0156552211f",
    "states_created": 2,
    "investment_states": [
      {
        "id": "uuid",
        "property_id": "...",
        "order_position": 0,
        "title": "Pre-venta",
        "description": "Fase de pre-venta",
        "status": "NOT_INITIATED",
        "is_current_state": true,
        "milestone_date": "2024-06-01",
        "created_at": "...",
        "updated_at": "...",
        "status_color": "gray"
      }
    ]
  }
}
```

**Respuesta 422 (validación):**
```json
{
  "error": {
    "code": "INV-422",
    "message": "Validation error",
    "details": { ... }
  }
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to create investment states"
  }
}
```

---

### 2.3 Mover al siguiente o anterior estado (Admin)

| Campo    | Valor |
|---------|--------|
| **Método** | `PUT` |
| **URL** | `/api/v1/properties/:propertyId/investment-states/move` |
| **Body** | Sí (JSON) |
| **Params** | `propertyId` (string, UUID de la propiedad) |

**Body:** al menos uno de los dos campos.
```json
{
  "next_state": true
}
```
o
```json
{
  "previous_state": true
}
```

- `next_state`: boolean, opcional.  
- `previous_state`: boolean, opcional.

**Respuesta 200 (éxito):**
```json
{
  "code": "INV-200",
  "message": "State moved successfully"
}
```

**Respuesta 422 (validación):**
```json
{
  "error": {
    "code": "INV-422",
    "message": "Validation error",
    "details": { ... }
  }
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to move state"
  }
}
```

---

### 2.4 Actualizar estado actual (status) (Admin)

| Campo    | Valor |
|---------|--------|
| **Método** | `PUT` |
| **URL** | `/api/v1/properties/:propertyId/investment-states/current` |
| **Body** | Sí (JSON) |
| **Params** | `propertyId` (string, UUID de la propiedad) |

**Body:**
```json
{
  "new_status": "ACTIVE"
}
```

Valores permitidos para `new_status`: `ACTIVE`, `DONE`, `FAILED`, `NOT_INITIATED`.

**Respuesta 200 (éxito):**
```json
{
  "code": "INV-200",
  "message": "Current state status updated successfully",
  "data": {
    "state": {
      "id": "uuid",
      "property_id": "...",
      "order_position": 0,
      "title": "Pre-venta",
      "description": "...",
      "status": "ACTIVE",
      "is_current_state": true,
      "milestone_date": "2024-06-01",
      "created_at": "...",
      "updated_at": "...",
      "status_color": "blue"
    }
  }
}
```

**Respuesta 422 (validación):**
```json
{
  "error": {
    "code": "INV-422",
    "message": "Validation error",
    "details": { ... },
    "valid_statuses": ["ACTIVE", "DONE", "FAILED", "NOT_INITIATED"]
  }
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to update current state"
  }
}
```

---

### 2.5 Añadir nuevo estado al final (Admin)

| Campo    | Valor |
|---------|--------|
| **Método** | `POST` |
| **URL** | `/api/v1/properties/:propertyId/investment-states/add` |
| **Body** | Sí (JSON) |
| **Params** | `propertyId` (string, UUID de la propiedad) |

**Body:**
```json
{
  "title": "Entrega",
  "description": "Entrega de unidades",
  "milestone_date": "2025-12-01"
}
```

- `title`: string, 1–255 caracteres, obligatorio.  
- `description`: string, opcional.  
- `milestone_date`: string, formato `YYYY-MM-DD`, obligatorio.

**Respuesta 201 (éxito):**
```json
{
  "code": "INV-201",
  "message": "New investment state added successfully",
  "data": {
    "state": {
      "id": "uuid",
      "property_id": "...",
      "order_position": 3,
      "title": "Entrega",
      "description": "Entrega de unidades",
      "status": "NOT_INITIATED",
      "is_current_state": false,
      "milestone_date": "2025-12-01",
      "created_at": "...",
      "updated_at": "...",
      "status_color": "gray"
    }
  }
}
```

**Respuesta 422 (validación):**
```json
{
  "error": {
    "code": "INV-422",
    "message": "Validation error",
    "details": { ... }
  }
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to add new investment state"
  }
}
```

---

### 2.6 Actualizar un estado específico (Admin)

| Campo    | Valor |
|---------|--------|
| **Método** | `PUT` |
| **URL** | `/api/v1/investment-states/:stateId` |
| **Body** | Sí (JSON) |
| **Params** | `stateId` (string, UUID del estado) |

**Body:** todos los campos son opcionales; se envían solo los que se quieren cambiar.
```json
{
  "title": "Pre-venta actualizado",
  "description": "Nueva descripción",
  "milestone_date": "2024-07-15"
}
```

- `title`: string, 1–255 caracteres.  
- `description`: string.  
- `milestone_date`: string, formato `YYYY-MM-DD`.

**Respuesta 200 (éxito):**
```json
{
  "code": "INV-200",
  "message": "Investment state updated successfully",
  "data": {
    "state": {
      "id": "uuid",
      "property_id": "...",
      "order_position": 0,
      "title": "Pre-venta actualizado",
      "description": "Nueva descripción",
      "status": "ACTIVE",
      "is_current_state": true,
      "milestone_date": "2024-07-15",
      "created_at": "...",
      "updated_at": "...",
      "status_color": "blue"
    }
  }
}
```

**Respuesta 422 (validación):**
```json
{
  "error": {
    "code": "INV-422",
    "message": "Validation error",
    "details": { ... }
  }
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to update investment state"
  }
}
```

---

### 2.7 Eliminar un estado (Admin)

| Campo    | Valor |
|---------|--------|
| **Método** | `DELETE` |
| **URL** | `/api/v1/investment-states/:stateId` |
| **Body** | No lleva body |
| **Params** | `stateId` (string, UUID del estado) |

**Respuesta 200 (éxito):**
```json
{
  "code": "INV-200",
  "message": "Investment state deleted successfully"
}
```

**Respuesta 400:**
```json
{
  "error": {
    "code": "INV-400",
    "message": "Failed to delete investment state"
  }
}
```

---

## Resumen rápido

| Recurso              | GET | POST | PUT | DELETE |
|----------------------|-----|------|-----|--------|
| Property Risk        | Obtener | Crear | Actualizar | Eliminar |
| Investment States    | Listar | Crear iniciales / Añadir uno | Mover / Actualizar actual / Actualizar por id | Eliminar por id |

Todos los endpoints de esta documentación requieren autenticación (JWT) salvo que se use un bypass de admin configurado en el servidor.
