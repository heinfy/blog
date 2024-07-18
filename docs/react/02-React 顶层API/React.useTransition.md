# React.useTransition

`const [isPending, startTransition] = useTransition()`

`React.useTransition` 是 React 提供的一个 Hook，用于管理渲染的过渡状态。**它用于在渲染过程中明确指定异步更新的开始和结束。这个 Hook 主要用于在渲染大量项目或动画时优化用户体验。**

```jsx
function App() {
  const [isPending, startTransition] = useTransition();
  const [filterTerm, setFilterTerm] = useState('');

  const filteredProducts = filterProducts(filterTerm);

  function updateFilterHandler(event) {
    // 降低更新优先级
    startTransition(() => {
      setFilterTerm(event.target.value);
    });
  }

  return (
    <div id='app'>
      <input
        type='text'
        onChange={updateFilterHandler}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
}
```
