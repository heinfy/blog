/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docusaurus: [
    'intro',
    {
      type: 'autogenerated',
      dirName: 'docusaurus'
    }
  ],
  react: [
    'p_react',
    {
      type: 'autogenerated',
      dirName: 'react'
    }
  ],
  vue: [
    'p_vue',
    {
      type: 'autogenerated',
      dirName: 'vue'
    }
  ],
  liunx: [
    'p_liunx',
    {
      type: 'autogenerated',
      dirName: 'liunx'
    }
  ]
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;
