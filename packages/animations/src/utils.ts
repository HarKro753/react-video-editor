export const calculateBoundingBoxWidth = (
  elementWidth: number,
  elementHeight: number,
  rotateAngle: number,
  scaleValue: number
) => {
  const angleRad = (rotateAngle * Math.PI) / 180;
  const scaledWidth = elementWidth * scaleValue;
  const scaledHeight = elementHeight * scaleValue;

  // Fórmula: |width * cos(angle)| + |height * sin(angle)| para el ancho del bounding box
  return (
    Math.abs(scaledWidth * Math.cos(angleRad)) +
    Math.abs(scaledHeight * Math.sin(angleRad))
  );
};

// Función para obtener los cuatro puntos del bounding box de un elemento rotado
export interface BoundingBoxPoint {
  x: number;
  y: number;
}

export interface BoundingBoxCorners {
  topLeft: BoundingBoxPoint;
  topRight: BoundingBoxPoint;
  bottomLeft: BoundingBoxPoint;
  bottomRight: BoundingBoxPoint;
  center: BoundingBoxPoint;
  width: number;
  height: number;
}

export const getBoundingBoxCorners = (
  elementX: number, // Posición X del elemento (centro)
  elementY: number, // Posición Y del elemento (centro)
  elementWidth: number,
  elementHeight: number,
  rotationAngle: number, // Ángulo en grados
  scaleValue: number = 1
): BoundingBoxCorners => {
  const angleRad = (rotationAngle * Math.PI) / 180;
  const scaledWidth = elementWidth * scaleValue;
  const scaledHeight = elementHeight * scaleValue;

  // Calcular las coordenadas de las esquinas relativas al centro antes de la rotación
  const halfWidth = scaledWidth / 2;
  const halfHeight = scaledHeight / 2;

  // Esquinas originales (sin rotación) relativas al centro
  const originalCorners = [
    { x: -halfWidth, y: -halfHeight }, // topLeft
    { x: halfWidth, y: -halfHeight }, // topRight
    { x: -halfWidth, y: halfHeight }, // bottomLeft
    { x: halfWidth, y: halfHeight } // bottomRight
  ];

  // Aplicar rotación a cada esquina
  const rotatedCorners = originalCorners.map((corner) => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    return {
      x: corner.x * cos - corner.y * sin,
      y: corner.x * sin + corner.y * cos
    };
  });

  // Convertir a coordenadas absolutas sumando la posición del elemento
  const absoluteCorners = rotatedCorners.map((corner) => ({
    x: corner.x + elementX,
    y: corner.y + elementY
  }));

  // Calcular el bounding box (rectángulo que contiene todas las esquinas)
  const allX = absoluteCorners.map((corner) => corner.x);
  const allY = absoluteCorners.map((corner) => corner.y);

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const boundingBoxWidth = maxX - minX;
  const boundingBoxHeight = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    topLeft: { x: minX, y: minY },
    topRight: { x: maxX, y: minY },
    bottomLeft: { x: minX, y: maxY },
    bottomRight: { x: maxX, y: maxY },
    center: { x: centerX, y: centerY },
    width: boundingBoxWidth,
    height: boundingBoxHeight
  };
};

// Función alternativa que devuelve solo los cuatro puntos de las esquinas del elemento rotado
export const getRotatedElementCorners = (
  elementX: number,
  elementY: number,
  elementWidth: number,
  elementHeight: number,
  rotationAngle: number,
  scaleValue: number = 1
): BoundingBoxPoint[] => {
  const angleRad = (rotationAngle * Math.PI) / 180;
  const scaledWidth = elementWidth * scaleValue;
  const scaledHeight = elementHeight * scaleValue;

  const halfWidth = scaledWidth / 2;
  const halfHeight = scaledHeight / 2;

  // Esquinas originales relativas al centro
  const corners = [
    { x: -halfWidth, y: -halfHeight }, // topLeft
    { x: halfWidth, y: -halfHeight }, // topRight
    { x: halfWidth, y: halfHeight }, // bottomRight
    { x: -halfWidth, y: halfHeight } // bottomLeft
  ];

  // Aplicar rotación y convertir a coordenadas absolutas
  return corners.map((corner) => {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    return {
      x: corner.x * cos - corner.y * sin + elementX,
      y: corner.x * sin + corner.y * cos + elementY
    };
  });
};

// Función para reemplazar el valor de translateX en una cadena de transformación CSS
export const replaceTranslateX = (
  transformString: string,
  newTranslateXValue: number
): string => {
  if (!transformString) return transformString;

  // Verificar si existe translateX en la cadena
  const translateXMatch = /translateX\([^)]+\)/.test(transformString);

  if (!translateXMatch) {
    // Si no existe translateX, devolver la cadena original sin modificar
    return transformString;
  }

  // Reemplazar el valor de translateX existente
  return transformString.replace(
    /translateX\([^)]+\)/,
    `translateX(${newTranslateXValue}px)`
  );
};

// Función alternativa que también maneja valores sin 'px'
export const replaceTranslateXFlexible = (
  transformString: string,
  newTranslateXValue: number,
  unit: string = "px"
): string => {
  if (!transformString) return transformString;

  // Verificar si existe translateX en la cadena
  const translateXMatch = /translateX\([^)]+\)/.test(transformString);

  if (!translateXMatch) {
    // Si no existe translateX, devolver la cadena original sin modificar
    return transformString;
  }

  // Reemplazar el valor de translateX existente, preservando la unidad original si existe
  return transformString.replace(/translateX\(([^)]+)\)/, (_, value) => {
    // Extraer la unidad del valor original si existe
    const unitMatch = value.match(/(\d+(?:\.\d+)?)(px|%|em|rem|vw|vh)?/);
    const originalUnit = unitMatch ? unitMatch[2] || unit : unit;

    return `translateX(${newTranslateXValue}${originalUnit})`;
  });
};
