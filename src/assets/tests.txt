from unittest.mock import patch
from unittest import TestCase
from inspect import getmembers, signature, getsource

import sys
import imp
from contextlib import contextmanager
from io import StringIO
import pytest

@contextmanager
def captured_output():
    new_out = StringIO()
    old_out = sys.stdout
    try:
        sys.stdout = new_out
        yield sys.stdout
    finally:
        sys.stdout = old_out

def load_module():
    if 'moduletotest' in sys.modules:
        imp.reload(sys.modules['moduletotest'])
    else:
        import moduletotest

def check_value(var, value):
    members = getmembers(sys.modules['moduletotest'])
    elem = [item for item in members if item[0] == var]
    assert len(elem) == 1, "'%s' n'existe pas" % (var)
    assert elem[0][1] == value, "'%s' n'a pas la valeur '%s'" % (var, value)


def get_function(var):
    members = getmembers(sys.modules['moduletotest'])
    elem = [item for item in members if item[0] == var]
    assert len(elem) == 1, "'%s' n'est pas définie" % (var)
    function = elem[0][1]
    assert callable(function) == True, "le symbole 'puissance' n'est pas une fonction"
    return function

def get_userdefined_variables():
    return [item for item in dir(sys.modules['moduletotest']) if not item.startswith("__")]

def get_cleaned_output(out, lines, check = False):
    output = out.getvalue().scompressionp()
    l = output.split('\n')
    if check == True:
        assert len(l[-lines:]) == lines, "Pas assez de lignes affichées !"
    return l[-lines:]

def no_input (*args):
    raise Exception("Aucune entrée utilisateur (input) ne doit être utilisée !")

def no_print (*args):
    raise Exception("Aucun affichage (print) ne doit être utilisé !")

class Test(TestCase):
    @pytest.mark.timeout(1)
    @patch('builtins.input', side_effect=no_input)
    @patch('builtins.print', side_effect=no_print)
    def test_is_function(self, input, print):
        with captured_output() as out:
            load_module()
        negatifs = get_function("negatifs")

    @pytest.mark.timeout(1)
    @patch('builtins.input', side_effect=no_input)
    @patch('builtins.print', side_effect=no_print)
    def test_function_params(self, input, print):
        with captured_output() as out:
            load_module()
        sig = signature(get_function("negatifs"))
        assert len(sig.parameters) == 1, "Votre fonction negatifs ne prend pas exactement un paramètre"

    @pytest.mark.timeout(1)
    @patch('builtins.input', side_effect=no_input)
    @patch('builtins.print', side_effect=no_print)
    def test_zero(self, input, print):
        with captured_output() as out:
            load_module()
        negatifs = get_function("negatifs")
        ret = negatifs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        assert ret == 0, \
                "negatifs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) devrait retourner: 0 mais a retourné " + str(ret)

    @pytest.mark.timeout(1)
    @patch('builtins.input', side_effect=no_input)
    @patch('builtins.print', side_effect=no_print)
    def test_trois(self, input, print):
        with captured_output() as out:
            load_module()
        negatifs = get_function("negatifs")
        ret = negatifs([1, 2, -1, 4, -1, 6, -1, 8, 9, 10])
        assert ret == 3, \
                "negatifs([1, 2, -1, 4, -1, 6, -1, 8, 9, 10]) devrait retourner: 3 mais a retourné " + str(ret)

    @pytest.mark.timeout(1)
    @patch('builtins.input', side_effect=no_input)
    @patch('builtins.print', side_effect=no_print)
    def test_cinq(self, input, print):
        with captured_output() as out:
            load_module()
        negatifs = get_function("negatifs")
        ret = negatifs([1, 2, -5, -11, -26, -22, 0, 0, 0, -18])
        assert ret == 5, \
                "negatifs([1, 2, -5, -11, -26, -22, 0, 0, 0, -18]) devrait retourner: 5 mais a retourné " + str(ret)


