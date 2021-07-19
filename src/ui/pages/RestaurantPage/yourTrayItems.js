import { useSelector } from 'react-redux';
import { accessCart, accessCartItems, accessCartStatus } from '../../../features/cart/cartSlice';
import { createMap, useUpdateCartHandler } from './hooks';
import React, { useCallback, useMemo } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardTitle } from 'reactstrap';
import { IconMinus, IconPlus, IconTrash } from '../../elements/icons';
import { PaginatedTable } from '../../elements/paginatedTable';
import { e2eAssist } from '../../../testability';

export function YourTrayItems({ checkout }) {

  const orderId = useSelector(accessCart('orderId'));
  const cartStatus = useSelector(accessCartStatus());
  const cartItems = useSelector(accessCartItems());
  const cartItemsMap = useMemo(() => createMap(cartItems || [], i => i.id), [ cartItems ]);
  const handleAddToCart = useUpdateCartHandler(orderId, cartItemsMap, undefined);

  const actionColumnFormatter = useCallback((cellContent, row, rowIdx, orderId) => {
    const disabled = !orderId || (typeof row.oldCount !== 'undefined');
    return <ButtonGroup size="sm">
      <Button color={ 'info' } size={ 'sm' } disabled={ disabled || (row.count === 0) } onClick={ handleAddToCart(row.id, undefined, row, -1) }><IconMinus /></Button>
      <Button color="link" disabled className={ disabled ? 'text-muted' : '' }> { row.count } </Button>
      <Button color={ 'info' } size={ 'sm' } disabled={ disabled } onClick={ handleAddToCart(row.id, undefined, row, 1) }><IconPlus /></Button>
    </ButtonGroup>;
  }, [ handleAddToCart ]);

  const columns = useMemo(() => ([
    {
      dataField: 'name',
      text: 'Food Item',
      sort: !checkout
    },
    {
      dataField: 'actions',
      isDummyField: true,
      text: 'Quantity',
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
      formatExtraData: orderId
    }
  ]), [ actionColumnFormatter, orderId, checkout ]);

  const defaultSorted = [ {
    dataField: 'name',
    order: 'desc'
  } ];

  if (!orderId || (cartStatus !== 'ready')) {
    return <>Updating the tray...</>;
  }

  if (checkout) {
    return cartItems.map((item, idx) => (
      <Card key={ item.id } className="mb-2" { ...e2eAssist.CARD_CHECKOUT_ITEM_FN(item.name, item.price) }>
        <CardBody>
          <CardTitle tag="h5">{ item.name }
            <div className="float-left pr-2">{ actionColumnFormatter(null, item, idx, orderId) }</div>
            <div className="float-right">
              <Button size="sm" outline onClick={ handleAddToCart(item.id, undefined, item, -item.count) } { ...e2eAssist.BTN_CHECKOUT_REMOVE_ITEM_FN(item.name, item.price) }><IconTrash /></Button>
            </div>
            <div className="float-right pr-2">
              <span className="text-monospace text-muted small">${ Number(item.price).toFixed(2) } &times; { Number(item.count) } = </span>${ (Number(item.price) * Number(item.count)).toFixed(2) }
            </div>
          </CardTitle>
        </CardBody>
      </Card>));
  }

  return <PaginatedTable
    bootstrap4
    hover
    keyField="id"
    data={ cartItems || [] }
    noDataIndication={ <span { ...e2eAssist.INFO_TRAY_IS_EMPTY }>Add food to your tray</span> }
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
    { ...e2eAssist.TBL_YOUR_TRAY }
  />;
}
