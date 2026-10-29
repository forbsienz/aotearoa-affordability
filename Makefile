.PHONY: pipeline sample-data fixtures dev install-pipeline install-web test-pipeline help

PYTHON ?= pipeline/.venv/bin/python

help:
	@echo "Aotearoa Affordability commands:"
	@echo "  make install-pipeline  Create venv + install Python dependencies"
	@echo "  make install-web       Install Next.js dependencies"
	@echo "  make fixtures          Generate fixture CSVs + build serving JSON"
	@echo "  make sample-data       Generate hand-crafted sample JSON only"
	@echo "  make pipeline          Full ETL (raw open-data downloads required)"
	@echo "  make test-pipeline     Run pytest"
	@echo "  make dev               Start Next.js dev server"

install-pipeline:
	cd pipeline && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

install-web:
	cd web && npm install

sample-data:
	cd pipeline && PYTHONPATH=src $(CURDIR)/$(PYTHON) scripts/generate_sample_data.py

fixtures:
	cd pipeline && PYTHONPATH=src $(CURDIR)/$(PYTHON) scripts/generate_fixtures.py && \
		PYTHONPATH=src $(CURDIR)/$(PYTHON) scripts/build_aggregates.py

pipeline:
	cd pipeline && PYTHONPATH=src $(CURDIR)/$(PYTHON) scripts/download_sources.py && \
		PYTHONPATH=src $(CURDIR)/$(PYTHON) scripts/build_aggregates.py

test-pipeline:
	cd pipeline && PYTHONPATH=src $(CURDIR)/$(PYTHON) -m pytest -q

dev:
	cd web && npm run dev
