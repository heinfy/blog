# React.useTransition

`const [isPending, startTransition] = useTransition()`

返回一个状态值表示过渡更新任务的等待状态，以及一个启动该过渡更新任务的函数。可以将状态更新包装起来告诉 React 这是一个低优先级的更新。

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
