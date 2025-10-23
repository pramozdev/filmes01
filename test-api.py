#!/usr/bin/env python3
"""
Script para testar a API de favoritos
"""

import requests
import json

# URL base da API
BASE_URL = "http://localhost:8000/api"

# Dados de teste
test_data = {
    "name": "Lista de Teste",
    "movies": [
        {
            "id": 123,
            "title": "Filme de Teste",
            "poster_path": "/test.jpg",
            "overview": "Este é um filme de teste",
            "vote_average": 8.5
        }
    ]
}

def test_save_favorites():
    """Testa o endpoint de salvar favoritos"""
    print("🧪 Testando endpoint de salvar favoritos...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/save/",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Teste passou!")
            return response.json()
        else:
            print("❌ Teste falhou!")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão. Verifique se o backend está rodando em http://localhost:8000")
        return None
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return None

def test_get_shared_list(list_id):
    """Testa o endpoint de buscar lista compartilhada"""
    print(f"🧪 Testando endpoint de buscar lista compartilhada (ID: {list_id})...")
    
    try:
        response = requests.get(f"{BASE_URL}/shared/{list_id}/")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Teste passou!")
            return True
        else:
            print("❌ Teste falhou!")
            return False
            
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Iniciando testes da API...")
    print("=" * 50)
    
    # Teste 1: Salvar favoritos
    result = test_save_favorites()
    
    if result and 'id' in result:
        print("\n" + "=" * 50)
        # Teste 2: Buscar lista compartilhada
        test_get_shared_list(result['id'])
    
    print("\n" + "=" * 50)
    print("🏁 Testes concluídos!")
