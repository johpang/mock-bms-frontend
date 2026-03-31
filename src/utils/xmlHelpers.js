/**
 * XML Serialization / Deserialization Helpers
 * Converts between JavaScript objects and XML strings for API communication.
 */

/**
 * Escapes special XML characters in a string value.
 * @param {string} str - The string to escape
 * @returns {string} XML-safe string
 */
function escapeXml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts a JavaScript object to an XML string.
 * Arrays are serialized with singular item tags (e.g. <vehicles><vehicle>...</vehicle></vehicles>).
 * @param {Object} obj - The object to serialize
 * @param {string} rootTag - The root element name
 * @returns {string} An XML string
 */
export function objectToXml(obj, rootTag = 'request') {
  function serialize(value, tag) {
    if (value === null || value === undefined) {
      return `<${tag}/>`;
    }
    if (Array.isArray(value)) {
      // Derive singular item tag: "vehicles" -> "vehicle", "drivers" -> "driver", etc.
      const itemTag = tag.endsWith('s') ? tag.slice(0, -1) : 'item';
      const items = value.map((item) => serialize(item, itemTag)).join('');
      return `<${tag}>${items}</${tag}>`;
    }
    if (typeof value === 'object') {
      const inner = Object.entries(value)
        .map(([key, val]) => serialize(val, key))
        .join('');
      return `<${tag}>${inner}</${tag}>`;
    }
    // Primitive: string, number, boolean
    return `<${tag}>${escapeXml(value)}</${tag}>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${serialize(obj, rootTag)}`;
}

/**
 * Parses an XML string into a JavaScript object.
 * Uses the browser's DOMParser.
 * Arrays are detected when multiple sibling elements share the same tag name,
 * or when the parent tag is a known collection name.
 * @param {string} xmlString - The XML string to parse
 * @returns {Object} The parsed JavaScript object
 */
export function xmlToObject(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  // Check for parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('XML parse error: ' + parseError.textContent);
  }

  /** Known collection parent tags whose children should always be arrays */
  const collectionTags = new Set([
    'results', 'vehicles', 'drivers', 'coverages',
    'coverageCodes', 'underwritingMessages', 'selectedInsurers',
  ]);

  function nodeToObject(node) {
    // Text-only node (leaf)
    if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
      const text = node.textContent.trim();
      // Try to convert to number or boolean
      if (text === 'true') return true;
      if (text === 'false') return false;
      if (text !== '' && !isNaN(text) && !text.startsWith('0') || text === '0') {
        // Avoid converting strings like "001" or phone numbers
        const num = Number(text);
        if (Number.isFinite(num)) return num;
      }
      return text;
    }

    // No children — empty tag
    if (node.childNodes.length === 0) {
      return '';
    }

    // Element children — build an object
    const obj = {};
    const childElements = Array.from(node.childNodes).filter((n) => n.nodeType === 1);

    // Check if all children share the same tag (pure array wrapper)
    const childTagNames = childElements.map((c) => c.tagName);
    const uniqueTags = new Set(childTagNames);

    if (uniqueTags.size === 1 && childElements.length > 1) {
      // All children have the same tag — treat as array
      return childElements.map((c) => nodeToObject(c));
    }

    // Check if this node is a known collection with one or more children
    if (collectionTags.has(node.tagName) && childElements.length >= 1 && uniqueTags.size === 1) {
      return childElements.map((c) => nodeToObject(c));
    }

    childElements.forEach((child) => {
      const key = child.tagName;
      const value = nodeToObject(child);

      if (obj.hasOwnProperty(key)) {
        // Duplicate key — convert to array
        if (!Array.isArray(obj[key])) {
          obj[key] = [obj[key]];
        }
        obj[key].push(value);
      } else {
        obj[key] = value;
      }
    });

    return obj;
  }

  return nodeToObject(doc.documentElement);
}
