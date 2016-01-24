<?php

/* @WebProfiler/Collector/router.html.twig */
class __TwigTemplate_a7201bfbb7c646279fe3fceda20f62a5ee3234096717e221d692904290f36e0f extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/router.html.twig", 1);
        $this->blocks = array(
            'toolbar' => array($this, 'block_toolbar'),
            'menu' => array($this, 'block_menu'),
            'panel' => array($this, 'block_panel'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@WebProfiler/Profiler/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_3c73e59bf9990f13978c40277882252185223bc52000b185dd3dfa783c95121d = $this->env->getExtension("native_profiler");
        $__internal_3c73e59bf9990f13978c40277882252185223bc52000b185dd3dfa783c95121d->enter($__internal_3c73e59bf9990f13978c40277882252185223bc52000b185dd3dfa783c95121d_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/router.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_3c73e59bf9990f13978c40277882252185223bc52000b185dd3dfa783c95121d->leave($__internal_3c73e59bf9990f13978c40277882252185223bc52000b185dd3dfa783c95121d_prof);

    }

    // line 3
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_cc13e7ec66490d921769e50f2387a93464b971e602a11a5b3193fe4081213c04 = $this->env->getExtension("native_profiler");
        $__internal_cc13e7ec66490d921769e50f2387a93464b971e602a11a5b3193fe4081213c04->enter($__internal_cc13e7ec66490d921769e50f2387a93464b971e602a11a5b3193fe4081213c04_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        
        $__internal_cc13e7ec66490d921769e50f2387a93464b971e602a11a5b3193fe4081213c04->leave($__internal_cc13e7ec66490d921769e50f2387a93464b971e602a11a5b3193fe4081213c04_prof);

    }

    // line 5
    public function block_menu($context, array $blocks = array())
    {
        $__internal_136f8b2d97e46ba3979b2d161e6811d2107255235b15f48f162eecffd8125daa = $this->env->getExtension("native_profiler");
        $__internal_136f8b2d97e46ba3979b2d161e6811d2107255235b15f48f162eecffd8125daa->enter($__internal_136f8b2d97e46ba3979b2d161e6811d2107255235b15f48f162eecffd8125daa_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 6
        echo "<span class=\"label\">
    <span class=\"icon\">";
        // line 7
        echo twig_include($this->env, $context, "@WebProfiler/Icon/router.svg");
        echo "</span>
    <strong>Routing</strong>
</span>
";
        
        $__internal_136f8b2d97e46ba3979b2d161e6811d2107255235b15f48f162eecffd8125daa->leave($__internal_136f8b2d97e46ba3979b2d161e6811d2107255235b15f48f162eecffd8125daa_prof);

    }

    // line 12
    public function block_panel($context, array $blocks = array())
    {
        $__internal_b209c05a4aef72c2cbe7fa0132cda74555f687d26f5da5520bb8d2a56271bb8e = $this->env->getExtension("native_profiler");
        $__internal_b209c05a4aef72c2cbe7fa0132cda74555f687d26f5da5520bb8d2a56271bb8e->enter($__internal_b209c05a4aef72c2cbe7fa0132cda74555f687d26f5da5520bb8d2a56271bb8e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 13
        echo "    ";
        echo $this->env->getExtension('http_kernel')->renderFragment($this->env->getExtension('routing')->getPath("_profiler_router", array("token" => (isset($context["token"]) ? $context["token"] : $this->getContext($context, "token")))));
        echo "
";
        
        $__internal_b209c05a4aef72c2cbe7fa0132cda74555f687d26f5da5520bb8d2a56271bb8e->leave($__internal_b209c05a4aef72c2cbe7fa0132cda74555f687d26f5da5520bb8d2a56271bb8e_prof);

    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/router.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  73 => 13,  67 => 12,  56 => 7,  53 => 6,  47 => 5,  36 => 3,  11 => 1,);
    }
}
/* {% extends '@WebProfiler/Profiler/layout.html.twig' %}*/
/* */
/* {% block toolbar %}{% endblock %}*/
/* */
/* {% block menu %}*/
/* <span class="label">*/
/*     <span class="icon">{{ include('@WebProfiler/Icon/router.svg') }}</span>*/
/*     <strong>Routing</strong>*/
/* </span>*/
/* {% endblock %}*/
/* */
/* {% block panel %}*/
/*     {{ render(path('_profiler_router', { token: token })) }}*/
/* {% endblock %}*/
/* */
