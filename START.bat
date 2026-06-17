@echo off
echo ================================
echo   MECHA - Demarrage de l'API
echo ================================

:: Creer le venv si absent
if not exist "venve\Scripts\activate.bat" (
    echo Creation de l'environnement virtuel...
    python -m venv venve
)

:: Activer le venv
call venve\Scripts\activate.bat

:: Installer les dependances
echo Installation des dependances...
pip install -r requirements.txt -q

:: Lancer l'app
echo.
echo Ouverture du dashboard sur http://127.0.0.1:5000
echo Appuie sur Ctrl+C pour arreter.
echo.
python app.py
