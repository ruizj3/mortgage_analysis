#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Aug  5 12:39:27 2023

@author: josephruiz
"""

import numpy as np
import pandas as pd


def rate_of_return(nper, pmt, compound, pv, rate_guess, fv):
    r_guess = 1 + rate_guess
    a = (pmt-pv) / (pv)
    b = (fv)/(pv)
    c = (-pmt - fv) / (pv)
    
    for i in range(nper):
        rtmp = r_guess - (r_guess**(nper + 1)\
                          + a*(r_guess**nper) + b*r_guess + c )\
                          /((nper + 1)* r_guess**nper + a*nper*(r_guess**(nper-1)) + b)
        if abs(rtmp - r_guess) < .00000001:
            break
        else:
            r_guess = rtmp
    return_percent = (r_guess**compound) - 1 #annualized return to Fannie Mae
    return return_percent

def npv_calc(rate,years,compound,payment):
    npv_list = []
    i = 0
    for i in range( (years*compound)):
        r = rate/compound
        npv = payment/((1+r)**(i+1))
        npv_list.append(npv)
    data = {'NPVs': npv_list}
    final = sum(npv_list)
    return final

def mortgage_check(loan=700000, dpp=0.2, r=0.07, years=30, compound=12,
                   prepayment=None,
                   price_paid=None,
                   rate_guess=None,
                   refi_rate=None,
                   refi_start_year=None):
    loan_principal = []
    loan_interest = []
    loan_paid_total = []
    loan_balance = []
    num_years = []
    
    prepayment_returns = []

    x = loan*(1-dpp)
    t_list = []
    
    f_rate=0
    npv = 0
    #calculate monthly payment, years*compound = periods
    payment = (r/compound) * (1/(1-(1+r/compound)**(-(years*compound))))*x
    #print("start payment "+str(payment))
    for i in range(years*compound):
        t_list.append(i)

        y = (x*r)/compound

        a = payment - y


        loan_principal.append(a)
        loan_interest.append(y)
        loan_paid_total.append(a+y)
        
        num_years.append((i+1)/12)
        if i == 0:
            loan_balance.append(loan - loan_principal[i])
        else:
            loan_balance.append(loan_balance[i-1] - loan_principal[i])
  
        x = x - a

    npv = npv_calc(rate=.04,
             years=years,
             compound=compound,
             payment=payment)
    data = {'month_number': t_list,
            'interest_paid': loan_interest,
            'principal_paid': loan_principal,
            'total_paid': loan_paid_total,
            'current_balance': loan_balance,
            'current_year_percentage': num_years}
    #final = pd.DataFrame(data=data)

    return data
print(mortgage_check())