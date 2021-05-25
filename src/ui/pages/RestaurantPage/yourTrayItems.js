import { useSelector } from 'react-redux';
import { accessCart, accessCartItems, accessCartStatus } from '../../../features/cart/cartSlice';
import { createMap, useUpdateCartHandler } from './hooks';
import { useCallback, useMemo } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { IconMinus, IconPlus } from '../../elements/icons';
import { PaginatedTable } from '../../elements/paginatedTable';

export function YourTrayItems() {

  const cartId = useSelector(accessCart('id'));
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  const cartItemsMap = useMemo(() => createMap(cartItems, i => i.id), [ cartItems ]);
  const handleAddToCart = useUpdateCartHandler(cartId, cartItemsMap, undefined);


  const actionColumnFormatter = useCallback((cellContent, row, rowIdx, cartId) => {
    const disabled = !cartId || typeof row.oldCount !== 'undefined';
    return <ButtonGroup size="sm">
      <Button color={ 'info' } size={ 'sm' } disabled={ disabled || (row.count === 0) } onClick={ handleAddToCart(row.id, undefined, row, -1) }><IconMinus /></Button>
      <Button color="link" disabled className={ disabled ? 'text-muted' : '' }> { row.count } </Button>
      <Button color={ 'info' } size={ 'sm' } disabled={ disabled } onClick={ handleAddToCart(row.id, undefined, row, 1) }><IconPlus /></Button>
    </ButtonGroup>;
  }, [ handleAddToCart ]);

  const columns = useMemo(() => ([
    {
      dataField: 'id',
      text: 'Ref ID'
    }, {
      dataField: 'name',
      text: 'Food Item',
      sort: true
    },
    {
      dataField: 'actions',
      isDummyField: true,
      text: 'Qty',
      sort: true,
      sortFunc: (a, b, order, dataField, rowA, rowB) => {
        if (order === 'asc') {
          return rowA.count - rowB.count;
        } else {
          return -(rowA.count - rowB.count);
        }
      },
      classes: 'text-right',
      formatter: actionColumnFormatter,
      formatExtraData: cartId
    }
  ]), [ actionColumnFormatter, cartId ]);

  const defaultSorted = [ {
    dataField: 'name',
    order: 'desc'
  } ];

  if (!cartId || (cartStatus !== 'ready')) {
    return <>Updating the tray...</>;
  }

  return <PaginatedTable
    bootstrap4
    hover
    keyField="id"
    data={ cartItems || [] }
    noDataIndication={ <>Add food to your tray</> }
    columns={ columns }
    defaultSorted={ defaultSorted }
    bordered={ false }
    paginationOnTop
    paginationFactoryOptions={ {
      custom: true,
      sizePerPage: 5,
      sizePerPageList: [ 5, 10, 25, 30, 50 ],
      hidePageListOnlyOnePage: true,
    } }
  />;
}
