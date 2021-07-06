import { FaSync as FaRefresh } from 'react-icons/fa';
import { FaHamburger, FaMapMarkerAlt, FaClock, FaSearch, FaEdit, FaPlus, FaMinus, FaCartPlus, FaTrashAlt } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa'
import React from 'react';
import theme from './icons.module.scss'
import { e2eAssist } from '../../testability';

export const IconRefresh = () => <FaRefresh className={ theme['icon-spin']} { ...e2eAssist.ICON_SPIN} />;
export const IconLogo = FaHamburger;
export const IconGeo = FaMapMarkerAlt;
export const IconClock = FaClock;
export const IconSearch = FaSearch;
export const IconEdit = FaEdit;
export const IconPlus = FaPlus;
export const IconTrash = FaTrashAlt;
export const IconCartPlus = FaCartPlus;
export const IconMinus = FaMinus;
export const IconChevronRight = FaChevronRight;
