# -*- coding: utf-8 -*-

from __future__ import print_function
from time import sleep
from ctypes import *
import requests
import json

def send(id):
  response = requests.post(
    'https://sharemngenocean.herokuapp.com/',
    headers={'Content-Type': 'application/json'},
    data=json.dumps({"device": id, "status": "nfc"}),
  )
  print(response.status_code)    # HTTPのステータスコード取得
  print(response.text)    # レスポンスのHTMLを文字列で取得


# libpafe.hの77行目で定義
FELICA_POLLING_ANY = 0xffff

#許可するidm番号を設定

if __name__ == '__main__':

    libpafe = cdll.LoadLibrary("/usr/local/lib/libpafe.so")
    libpafe.pasori_open.restype = c_void_p
    pasori = libpafe.pasori_open()
    libpafe.pasori_init(pasori)
    libpafe.felica_polling.restype = c_void_p
    
    try:
        while True:
            felica = libpafe.felica_polling(pasori, FELICA_POLLING_ANY, 0, 0)
            idm = c_ulonglong() 
            libpafe.felica_get_idm.restype = c_void_p
            libpafe.felica_get_idm(felica, byref(idm))
            idm_No = "%016X" % idm.value
            if idm_No == '0000000000000000':
                pass
            else:
                print(idm_No)
                send(idm_No)
            sleep(0.1)

    except KeyboardInterrupt:
        print('finished')
        libpafe.free(felica)
        libpafe.pasori_close(pasori)

