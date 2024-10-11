export function specificationShortcode({ key, value, link }) {
  if (!key || !value) throw new Error('Specification must include a key and value');
  const val = link ? `<a href="${link}" target="_blank">${value}</a>` : value;

  return `
    <div class="specification">
      <span class="key">${key}</span>
      <span class="value">${val}</span>
    </div>
  `;
}