# LocalSvg

A lightweight, performant React component for loading and rendering local or remote SVG files directly as React components. Skip bloated icon libraries and streamline your custom icon workflow.

## Why LocalSvg?

- **No Icon Set Bloat**: Use only the SVGs you need without including massive icon library dependencies
- **Smart Caching**: Automatic localStorage caching with in-memory promise caching for optimal performance
- **Automatic Minification**: SVG files are automatically minified to reduce bandwidth and storage
- **Pure React Components**: SVGs are parsed and rendered as native React components with full TypeScript support
- **Flexible Loading**: Load SVGs from any URL or local path
- **Namespace Aware**: Automatically handles XML/SVG namespaces and converts them to React-compatible attributes
- **Lightweight**: No external dependencies (except React)

## Installation

```bash
npm install local-svg
```

Or with yarn:

```bash
yarn add local-svg
```

## Quick Start

```tsx
import { LocalSvg } from 'local-svg';

export default function App() {
  return (
    <LocalSvg 
      name="icon-name"
      width={24}
      height={24}
    />
  );
}
```

## Props

### LocalSvgProps

Extends `SVGAttributes<SVGSVGElement>`, so you can use any standard SVG element props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | The name of the SVG file (without `.svg` extension) |
| `baseUrl` | `string` | `"/"` | The base URL or path where SVG files are located |
| `as` | `React.ElementType` | `"span"` | The wrapper component to use while loading |
| `ref` | `RefObject<SVGSVGElement>` | - | Forward ref to the SVG element |
| `...rest` | `SVGAttributes` | - | Any standard SVG attributes (className, style, onClick, etc.) |

## Usage Examples

### Basic Icon

```tsx
<LocalSvg name="star" width={24} height={24} />
```

### With Custom Styling

```tsx
<LocalSvg 
  name="logo"
  width={100}
  height={100}
  className="logo-icon"
  style={{ color: '#007bff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
/>
```

### Custom Base URL

```tsx
<LocalSvg 
  name="icon"
  baseUrl="/static/icons/"
/>
```

### With Event Handlers

```tsx
<LocalSvg 
  name="button-icon"
  width={20}
  height={20}
  onClick={() => console.log('Clicked!')}
  style={{ cursor: 'pointer' }}
/>
```

### With Loading Placeholder

```tsx
<LocalSvg 
  name="spinner"
  width={24}
  height={24}
  as="div"
  className="loading-placeholder"
/>
```

The `as` prop specifies what to render while the SVG is loading (defaults to `span`).

## How It Works

1. **Fetching**: Loads the SVG file from the URL when the component mounts
2. **Parsing**: Converts the SVG text into a React-friendly structure
3. **Minification**: Removes unnecessary data from the SVG (whitespace, comments, etc.) to save space
4. **Caching**: 
   - Stores the minified SVG in browser localStorage so it doesn't need to be fetched again
   - Uses in-memory cache to prevent duplicate requests in the same session
5. **Rendering**: Displays the SVG as native React elements

## Performance Optimizations

LocalSvg is built for speed:

- **Smart Caching**: localStorage persists minified SVGs across page reloads, reducing bandwidth on return visits by 99%
- **Size Reduction**: SVGs are automatically cleaned up, saving 40-60% of file size on average
- **React Optimized**: Prevents unnecessary re-renders and avoids duplicate fetch requests

## TypeScript Support

Full TypeScript support is built-in:

```tsx
import { LocalSvg, type LocalSvgProps } from 'local-svg';

const IconWrapper: React.FC<LocalSvgProps> = (props) => {
  return <LocalSvg {...props} />;
};
```

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- React 18+
- localStorage API

## API Reference

### LocalSvg

The main React component for rendering SVGs.

```tsx
<LocalSvg
  name="icon-name"
  baseUrl="/"
  as="span"
  width={24}
  height={24}
  className="my-icon"
  // ... any SVG attributes
  ref={svgRef}
/>
```

## License

MIT © Godswill Anwuli
