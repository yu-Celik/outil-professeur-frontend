# Soutenance CDA Workflow Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/soutenance-cda/workflow.yaml</critical>

<step n="1" goal="Configuration Initiale">
  <action>Déterminer le type de projet pour adapter les questions.</action>
  <ask>Votre projet a-t-il une interface utilisateur graphique (GUI) ? (oui/non)</ask>
  <template-output>has_gui</template-output>
</step>

<step n="2" goal="Introduction">
  <action>Générer la section d'introduction du document.</action>
  <ask>Veuillez fournir le contenu pour l'introduction (présentation personnelle, objectif du titre, annonce du plan).</ask>
  <template-output>introduction_content</template-output>
</step>

<step n="3" goal="Présentation du Projet">
  <action>Détailler le projet en plusieurs sous-étapes.</action>
  
  <step n="3a" title="Contexte et Besoins">
    <ask>Veuillez décrire la présentation de l'entreprise et le contexte du projet.</ask>
    <template-output>project_context</template-output>
    <ask>Veuillez décrire l'expression des besoins, la gestion de projet (méthodologie, planning, outils).</ask>
    <template-output>project_needs_management</template-output>
  </step>
  
  <step n="3b" title="Spécifications et Architecture">
    <ask>Veuillez décrire les spécifications fonctionnelles et l'architecture logicielle choisie. Fournissez les maquettes et le modèle de la base de données.</ask>
    <template-output>project_specs_architecture</template-output>
  </step>
  
  <step n="3c" title="Réalisations Techniques et Sécurité">
    <check if="{{has_gui}} == 'oui'">
      <ask>Veuillez fournir un extrait de code significatif de votre interface utilisateur (UI).</ask>
      <template-output>ui_code_snippet</template-output>
    </check>
    <check if="{{has_gui}} == 'non'">
      <ask>Veuillez décrire le point d'entrée de votre application (ex: classe principale, script de démarrage).</ask>
      <template-output>app_entry_point_description</template-output>
    </check>
    <ask>Veuillez fournir un extrait de code significatif de votre logique métier.</ask>
    <template-output>business_logic_code_snippet</template-output>
    <ask>Veuillez fournir un extrait de code significatif de votre accès aux données.</ask>
    <template-output>data_access_code_snippet</template-output>
    <ask>Veuillez fournir une explication sur la manière dont vous avez sécurisé l'application (protection contre les injections SQL, XSS, etc.).</ask>
    <template-output>security_explanation_sql_xss</template-output>
    <ask>Veuillez fournir une explication sur la gestion de l'authentification.</ask>
    <template-output>security_explanation_auth</template-output>
  </step>

  <step n="3d" title="Tests et Veille">
    <ask>Veuillez décrire le plan de tests que vous avez mis en place et donnez un exemple de jeu d'essai.</ask>
    <template-output>testing_plan</template-output>
    <ask>Veuillez expliquer la veille technologique que vous avez effectuée.</ask>
    <template-output>tech_watch</template-output>
  </step>

  <step n="3e" title="Conclusion du Projet">
    <ask>Veuillez résumer ce que vous avez accompli, les difficultés rencontrées et ce que ce projet vous a apporté.</ask>
    <template-output>project_conclusion</template-output>
  </step>
</step>

<step n="4" goal="Synthèse des Compétences">
  <action>Lier le projet aux compétences du référentiel en fournissant un exemple pour chacune.</action>
  <ask>Compétence 'Installer et configurer son environnement de travail': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_env_example</template-output>
  <ask>Compétence 'Développer des interfaces utilisateur': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_ui_example</template-output>
  <ask>Compétence 'Développer des composants métier': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_biz_example</template-output>
  <ask>Compétence 'Contribuer à la gestion d'un projet informatique': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_pm_example</template-output>
  <ask>Compétence 'Analyser les besoins et maquetter une application': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_analysis_example</template-output>
  <ask>Compétence 'Définir l'architecture logicielle': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_archi_example</template-output>
  <ask>Compétence 'Concevoir et mettre en place une base de données': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_db_example</template-output>
  <ask>Compétence 'Développer des composants d'accès aux données': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_dal_example</template-output>
  <ask>Compétence 'Préparer et exécuter les plans de tests': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_test_example</template-output>
  <ask>Compétence 'Préparer et documenter le déploiement': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_deploy_example</template-output>
  <ask>Compétence 'Contribuer à la mise en production dans une démarche DevOps': Donnez un exemple concret de mise en œuvre.</ask>
  <template-output>competence_devops_example</template-output>
</step>

<step n="5" goal="Conclusion">
  <action>Générer la conclusion du document.</action>
  <ask>Veuillez fournir le contenu pour la conclusion générale (bilan personnel, projet professionnel).</ask>
  <template-output>conclusion_content</template-output>
</step>

</workflow>
