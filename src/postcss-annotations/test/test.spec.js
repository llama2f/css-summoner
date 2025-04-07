import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import plugin from '../src/index.js'; // Assuming src/index.js is the plugin entry point

// Helper function to run the PostCSS plugin
async function run(input, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, {
    from: 'test.css',
  });
  // Extract data from messages for easier testing
  const dataMessage = result.messages.find(
    (msg) => msg.type === 'css-annotations-data',
  );
  return dataMessage ? dataMessage.data : null;
}

// Test CSS content
const testCSS = `
/* 
 * @component: button
 * @variant: base
 * @description: すべてのボタンの基本スタイル
 * @category: interactive
 */
.btn-base {
  display: inline-block;
  padding: 0.5rem 1rem;
}

/* 
 * @component: button
 * @variant: primary
 * @description: プライマリカラーを使用した重要なアクション用ボタン
 * @category: interactive
 * @example: <button class="btn-base btn-primary">プライマリボタン</button>
 */
.btn-primary {
  background-color: blue;
  color: white;
}

/* 通常のコメント - アノテーションではない */
.normal-class {
  margin: 1rem;
}

/* 
 * @component: card
 * @variant: base
 * @description: カードコンポーネントの基本スタイル
 */
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
}
`;

describe('postcss-css-annotations plugin', () => {
  it('should extract component annotations correctly', async () => {
    const data = await run(testCSS);

    expect(data).not.toBeNull();

    // Verify componentTypes
    expect(data.componentTypes).toHaveProperty('button');
    expect(data.componentTypes).toHaveProperty('card');
    expect(data.componentTypes.button).toEqual(['btn-base', 'btn-primary']);
    expect(data.componentTypes.card).toEqual(['card']);
    expect(Object.keys(data.componentTypes).length).toBe(2);

    // Verify baseClasses
    expect(data.baseClasses).toHaveProperty('button', 'btn-base');
    expect(data.baseClasses).toHaveProperty('card', 'card');
    expect(Object.keys(data.baseClasses).length).toBe(2); // base variant is required

    // Verify componentVariants
    expect(data.componentVariants).toHaveProperty('button');
    expect(data.componentVariants.button).toHaveProperty('base', 'btn-base');
    expect(data.componentVariants.button).toHaveProperty(
      'primary',
      'btn-primary',
    );
    expect(data.componentVariants).toHaveProperty('card');
    expect(data.componentVariants.card).toHaveProperty('base', 'card');

    // Verify classDescriptions
    expect(Object.keys(data.classDescriptions).length).toBe(3);
    expect(data.classDescriptions).toHaveProperty('btn-base');
    expect(data.classDescriptions['btn-base']).toEqual({
      component: 'button',
      variant: 'base',
      description: 'すべてのボタンの基本スタイル',
      category: 'interactive',
    });
    expect(data.classDescriptions).toHaveProperty('btn-primary');
    expect(data.classDescriptions['btn-primary']).toEqual({
      component: 'button',
      variant: 'primary',
      description: 'プライマリカラーを使用した重要なアクション用ボタン',
      category: 'interactive',
    });
    expect(data.classDescriptions).toHaveProperty('card');
    // --- Test Fix 1: Add expected default category ---
    expect(data.classDescriptions['card']).toEqual({
      component: 'card',
      variant: 'base',
      description: 'カードコンポーネントの基本スタイル',
      category: 'other', // Expect default category 'other'
    });

    // Verify componentExamples
    expect(data.componentExamples).toHaveProperty('button');
    expect(data.componentExamples.button.length).toBe(1);
    expect(data.componentExamples.button[0]).toEqual({
      variant: 'primary',
      className: 'btn-primary',
      example: '<button class="btn-base btn-primary">プライマリボタン</button>',
    });
    expect(data.componentExamples).not.toHaveProperty('card'); // No example for card

    // Verify classRuleDetails (basic check)
    expect(data.classRuleDetails).toHaveProperty('btn-base');
    expect(data.classRuleDetails['btn-base'].selector).toBe('.btn-base');
    expect(data.classRuleDetails['btn-base'].sourceFile).toBe('test.css');
    expect(data.classRuleDetails).toHaveProperty('btn-primary');
    expect(data.classRuleDetails).toHaveProperty('card');

    // Verify meta information
    expect(data.meta.totalClasses).toBe(3);
    expect(data.meta.errors).toEqual([]); // Expect no errors in this basic case
    expect(data.meta.source).toBe('test.css');
  });

  it('should handle CSS without annotations', async () => {
    const css = `.no-annotations { color: red; }`;
    const data = await run(css);
    expect(data).not.toBeNull();
    expect(data.meta.totalClasses).toBe(0);
    expect(Object.keys(data.componentTypes).length).toBe(0);
    expect(Object.keys(data.classDescriptions).length).toBe(0);
  });

  it('should report errors for missing required tags', async () => {
    const css = `
     /* 
      * @component: alert
      * @variant: warning 
      * Missing description
      */
     .alert-warning { color: orange; }`;
    // Need to check result.messages directly for errors if plugin adds them there
    const result = await postcss([plugin({ verbose: true })]).process(css, {
      from: 'error-test.css',
    });
    const dataMessage = result.messages.find(
      (msg) => msg.type === 'css-annotations-data',
    );
    const errorMessages = result.messages.filter(
      (msg) =>
        msg.type === 'warning' && msg.plugin === 'postcss-css-annotations',
    );

    expect(dataMessage).not.toBeNull();
    expect(dataMessage.data.meta.totalClasses).toBe(0); // Should not register the class due to error
    expect(dataMessage.data.meta.errors.length).toBeGreaterThan(0);
    // --- Test Fix 2: Adjust expected error message format ---
    expect(dataMessage.data.meta.errors[0]).toContain(
      'に必須タグがありません: @description:',
    ); // Check for the core part of the message

    // Also check PostCSS warnings if the plugin uses result.warn()
    expect(errorMessages.length).toBeGreaterThan(0);
    // --- Test Fix 2: Adjust expected warning message format ---
    expect(errorMessages[0].text).toContain(
      'に必須タグがありません: @description:',
    ); // Check for the core part of the message
  });

  it('should respect custom requiredTags option', async () => {
    const css = `
     /* 
      * @component: badge
      * @variant: info
      * @description: Informational badge
      * @category: display 
      */
     .badge-info { background: blue; }
     
     /* Base variant for badge to avoid unrelated errors */
     /* 
      * @component: badge
      * @variant: base
      * @description: Base badge style
      */
     .badge-base { padding: 0.2em; } 
     `;
    // Only require @component and @variant
    const data = await run(css, { requiredTags: ['@component:', '@variant:'] });
    expect(data).not.toBeNull();
    // --- Test Fix 3: Expect 2 classes now (info and base) ---
    expect(data.meta.totalClasses).toBe(2);
    // --- Test Fix 3: Expect no errors now that base variant is present ---
    expect(data.meta.errors).toEqual([]);
    expect(data.classDescriptions).toHaveProperty('badge-info');
    expect(data.classDescriptions).toHaveProperty('badge-base');
  });

  // Add more tests for other options (outputPath, recognizedTags, verbose)
  // Add tests for edge cases (empty comments, malformed tags, etc.)
});
